// pages/api/classroom/[id]/documents.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the authenticated user session
  const user = await getCurrentUser();

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get the classroom ID from the URL
  const classroomId = req.query.id as string;

  // Get the user from the database to check role
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!dbUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if the user has access to this classroom
  const classroom = await prisma.classroom.findUnique({
    where: {
      id: classroomId,
    },
    include: {
      students: {
        where: {
          userId: user.id,
        },
      },
      teacher: {
        where: {
          id: user.id,
        },
      },
    },
  });

  if (!classroom) {
    return res.status(404).json({ error: 'Classroom not found' });
  }

  // Check if user is a teacher or student in this classroom
  const isTeacher = classroom.teacherId === user.id;
  const isStudent = classroom.students.some(student => student.userId === user.id);

  if (!isTeacher && !isStudent) {
    return res.status(403).json({ error: 'Access denied to this classroom' });
  }

  // Handle GET request - Return documents for this classroom
  if (req.method === 'GET') {
    const documents = await prisma.document.findMany({
      where: {
        classroomId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        documentProgress: {
          where: {
            userId: user.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      createdAt: doc.createdAt,
      teacherName: doc.createdBy.name,
      // For students, add progress information
      ...(dbUser.role === 'student' && {
        viewed: doc.documentProgress.length > 0 ? true : false,
        completed: doc.documentProgress.length > 0 ? doc.documentProgress[0].completed : false,
      }),
    }));

    return res.status(200).json({ documents: formattedDocuments });
  }

  // Handle POST request (teachers only) - Create a new document
  if (req.method === 'POST' && isTeacher) {
    const { title, description, fileUrl, fileType } = req.body;

    const newDocument = await prisma.document.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        classroomId,
        createdById: user.id,
      },
    });

    return res.status(201).json(newDocument);
  }

  // Return method not allowed for other request types
  return res.status(405).json({ error: 'Method not allowed' });
}