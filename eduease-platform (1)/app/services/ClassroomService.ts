// app/services/ClassroomService.ts
// This implementation uses in-memory storage to bypass database issues

export interface ClassroomData {
    name: string;
    description?: string;
    subject?: string;
    teacherId: number;
    roomCode: string;
    grade?: string;
  }
  
  export interface ClassroomResponse {
    id: number;
    name: string;
    description?: string;
    subject?: string;
    teacherId: number;
    roomCode: string;
    createdAt: Date;
    updatedAt: Date;
    students?: number;
    color?: string;
    grade?: string;
  }
  
  // In-memory storage for classrooms
  const classrooms: ClassroomResponse[] = [];
  // In-memory storage for student-classroom relationships
  const classroomStudents: {classroomId: number, studentId: number}[] = [];
  
  // Next available ID for new classrooms
  let nextId = 1;
  
  export class ClassroomService {
    /**
     * Create a new classroom
     * @param data Classroom data
     * @returns The created classroom
     */
    async createClassroom(data: ClassroomData): Promise<ClassroomResponse> {
      try {
        // Create new classroom object
        const newClassroom: ClassroomResponse = {
          id: nextId++,
          name: data.name,
          description: data.description,
          subject: data.subject,
          teacherId: data.teacherId,
          roomCode: data.roomCode,
          grade: data.grade,
          createdAt: new Date(),
          updatedAt: new Date(),
          students: 0,
          color: this.getColorForSubject(data.subject || '')
        };
        
        // Store in our in-memory array
        classrooms.push(newClassroom);
        
        console.log(`Created classroom: ${JSON.stringify(newClassroom)}`);
        return newClassroom;
      } catch (error) {
        console.error("Error in createClassroom:", error);
        throw error;
      }
    }
  
    /**
     * Get all classrooms for a teacher
     * @param teacherId Teacher ID
     * @returns List of classrooms
     */
    async getTeacherClassrooms(teacherId: number): Promise<ClassroomResponse[]> {
      try {
        // Filter classrooms by teacher ID
        return classrooms.filter(classroom => classroom.teacherId === teacherId);
      } catch (error) {
        console.error("Error in getTeacherClassrooms:", error);
        return [];
      }
    }
  
    /**
     * Get all classrooms for a student
     * @param studentId Student ID
     * @returns List of classrooms
     */
    async getStudentClassrooms(studentId: number): Promise<ClassroomResponse[]> {
      try {
        // Get classroom IDs for this student
        const studentClassroomIds = classroomStudents
          .filter(cs => cs.studentId === studentId)
          .map(cs => cs.classroomId);
        
        // Return all classrooms matching those IDs
        return classrooms.filter(classroom => 
          studentClassroomIds.includes(classroom.id)
        );
      } catch (error) {
        console.error("Error in getStudentClassrooms:", error);
        return [];
      }
    }
  
    /**
     * Get a classroom by its code
     * @param code Classroom code
     * @returns Classroom data or null if not found
     */
    async getClassroomByCode(code: string): Promise<ClassroomResponse | null> {
      try {
        // Find classroom by code
        const classroom = classrooms.find(c => c.roomCode === code);
        return classroom || null;
      } catch (error) {
        console.error("Error in getClassroomByCode:", error);
        return null;
      }
    }
  
    /**
     * Join a classroom as a student
     * @param classroomId Classroom ID
     * @param studentId Student ID
     * @returns Success status
     */
    async joinClassroom(classroomId: number, studentId: number): Promise<boolean> {
      try {
        // Check if already joined
        const alreadyJoined = classroomStudents.some(
          cs => cs.classroomId === classroomId && cs.studentId === studentId
        );
        
        if (alreadyJoined) {
          return true;
        }
        
        // Add the relationship
        classroomStudents.push({ classroomId, studentId });
        
        // Update student count
        const classroom = classrooms.find(c => c.id === classroomId);
        if (classroom) {
          classroom.students = (classroom.students || 0) + 1;
        }
        
        return true;
      } catch (error) {
        console.error("Error in joinClassroom:", error);
        return false;
      }
    }
  
    /**
     * Get color for a subject
     * @param subject Subject name
     * @returns CSS color classes
     */
    private getColorForSubject(subject: string): string {
      const subject_lower = subject.toLowerCase();
      
      if (subject_lower.includes('math')) {
        return "bg-blue-100 text-blue-800 border-blue-200";
      } else if (subject_lower.includes('english') || subject_lower.includes('reading') || subject_lower.includes('language')) {
        return "bg-green-100 text-green-800 border-green-200";
      } else if (subject_lower.includes('science')) {
        return "bg-purple-100 text-purple-800 border-purple-200";
      } else if (subject_lower.includes('history') || subject_lower.includes('social')) {
        return "bg-amber-100 text-amber-800 border-amber-200";
      } else if (subject_lower.includes('art')) {
        return "bg-pink-100 text-pink-800 border-pink-200";
      } else if (subject_lower.includes('music')) {
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      } else {
        // Default color
        return "bg-blue-100 text-blue-800 border-blue-200";
      }
    }
  }