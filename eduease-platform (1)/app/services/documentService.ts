// app/services/documentService.ts

import { createClient } from '@/lib/supabase/client';

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  teacherId: string;
  classroomId: string;
}

export interface DocumentUploadParams {
  title: string;
  description?: string;
  file: File;
  teacherId: string;
  classroomId: string;
}

export class DocumentService {
  private supabase = createClient();

  /**
   * Upload a document to storage and create a record in the database
   */
  async uploadDocument({
    title,
    description,
    file,
    teacherId,
    classroomId,
  }: DocumentUploadParams): Promise<Document | null> {
    try {
      // Generate a unique filename to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${classroomId}/${fileName}`;

      // 1. Upload file to storage
      const { data: fileData, error: uploadError } = await this.supabase.storage
        .from('learning-materials')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw new Error('Failed to upload file');
      }

      // 2. Get the public URL for the uploaded file
      const { data: urlData } = await this.supabase.storage
        .from('learning-materials')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      // 3. Insert record in the documents table
      const { data: document, error: dbError } = await this.supabase
        .from('documents')
        .insert({
          title,
          description,
          file_url: fileUrl,
          file_type: file.type,
          file_size: file.size,
          teacher_id: teacherId,
          classroom_id: classroomId,
        })
        .select('*')
        .single();

      if (dbError) {
        console.error('Error creating document record:', dbError);
        // Clean up the uploaded file if database insert fails
        await this.supabase.storage.from('learning-materials').remove([filePath]);
        throw new Error('Failed to create document record');
      }

      // 4. Link document to all students in the classroom
      const { data: students, error: studentsError } = await this.supabase
        .from('classroom_students')
        .select('student_id')
        .eq('classroom_id', classroomId);

      if (studentsError) {
        console.error('Error fetching classroom students:', studentsError);
      } else {
        // Create entries in student_documents for each student
        const studentDocuments = students.map((student) => ({
          document_id: document.id,
          student_id: student.student_id,
          viewed: false,
          completed: false,
        }));

        const { error: linkError } = await this.supabase
          .from('student_documents')
          .insert(studentDocuments);

        if (linkError) {
          console.error('Error linking document to students:', linkError);
        }
      }

      return {
        id: document.id,
        title: document.title,
        description: document.description || '',
        fileUrl: document.file_url,
        fileType: document.file_type,
        fileSize: document.file_size,
        createdAt: document.created_at,
        updatedAt: document.updated_at,
        teacherId: document.teacher_id,
        classroomId: document.classroom_id,
      };
    } catch (error) {
      console.error('Document upload failed:', error);
      return null;
    }
  }

  /**
   * Get documents for a specific classroom
   */
  async getClassroomDocuments(classroomId: string): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('documents')
      .select('*')
      .eq('classroom_id', classroomId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching classroom documents:', error);
      return [];
    }

    return data.map((doc) => ({
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      fileUrl: doc.file_url,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
      teacherId: doc.teacher_id,
      classroomId: doc.classroom_id,
    }));
  }

  /**
   * Get documents for a specific student within a classroom
   */
  async getStudentDocuments(studentId: string, classroomId: string): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from('student_documents')
      .select(`
        viewed, completed,
        documents:document_id(*)
      `)
      .eq('student_id', studentId)
      .in('document_id', (subquery) => {
        subquery
          .from('documents')
          .select('id')
          .eq('classroom_id', classroomId);
      });

    if (error) {
      console.error('Error fetching student documents:', error);
      return [];
    }

    return data.map((item) => {
      const doc = item.documents;
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        fileUrl: doc.file_url,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        teacherId: doc.teacher_id,
        classroomId: doc.classroom_id,
        viewed: item.viewed,
        completed: item.completed,
      };
    });
  }
}