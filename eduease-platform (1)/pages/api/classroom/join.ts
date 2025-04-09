// pages/api/classrooms/join.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { classroomStudents } from '@/db/schema';
import  { useClassroomStore }  from '@/lib/store/classroom-store';

interface JoinRequestBody {
  code: string;
  userId: number | string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, userId } = req.body as JoinRequestBody;

    if (!code || !userId) {
      return res.status(400).json({ error: 'Classroom code and user ID are required' });
    }

    // Get the classroom store instance
    const getClassroomByCode = useClassroomStore.getState().getClassroomByCode;
    
    // Find the classroom with this code
    const classroom = getClassroomByCode(code);

    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    // Check if the student is already in this classroom
    // In a real implementation, you'd query the database to check this
    const isStudentAlreadyJoined = false; // Replace with actual check
    
    if (isStudentAlreadyJoined) {
      return res.status(409).json({ error: 'Student is already in this classroom' });
    }

    // Add the student to the classroom
    // In a real implementation, you'd insert a record into the classroomStudents table
    try {
      // Example of how you'd implement this with the database
      // await db.insert(classroomStudents).values({
      //   classroomId: Number(classroom.id),
      //   studentId: Number(userId),
      //   joinedAt: new Date()
      // });

      // Return success response
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully joined classroom',
        classroom: {
          id: classroom.id,
          name: classroom.name,
          subject: classroom.subject
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to join classroom' });
    }

  } catch (error) {
    console.error('Error joining classroom:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
}