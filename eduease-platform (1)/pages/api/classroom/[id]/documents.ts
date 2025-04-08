// pages/api/classrooms/[id]/documents.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the authenticated user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get the classroom ID from the URL
  const classroomId = req.query.id as string;
  
  // Get the user from the database to check role
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      role: true,
    },
  });
  
  if (!user) {
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
          id: user.id,
        },
      },
      teachers: {
        where: {
          id: user.id,
        },
      },
    },
  });
  
  if (!classroom || (classroom.students.length === 0 && classroom.teachers.length === 0)) {
    return res.status(403).json({ error: 'Access denied to this classroom' });
  }
  
  // Handle GET request - fetch documents for a classroom
  if (req.method === 'GET') {
    const documents = await prisma.document.findMany({
      where: {
        classroomId: classroomId,
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Transform the documents to the expected format
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      uploadedBy: doc.uploadedBy.name,
      uploadDate: doc.createdAt.toISOString().split('T')[0],
      sessionId: doc.sessionId,
    }));
    
    return res.status(200).json({ documents: formattedDocuments });
  }
  
  // Handle POST request - create a new document (teachers only)
  if (req.method === 'POST') {
    // Check if the user is a teacher
    if (user.role !== 'teacher' && classroom.teachers.length === 0) {
      return res.status(403).json({ error: 'Only teachers can upload documents' });
    }
    
    const { name, sessionId } = req.body;
    
    if (!name || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create the document
    const document = await prisma.document.create({
      data: {
        name,
        sessionId,
        classroom: {
          connect: {
            id: classroomId,
          },
        },
        uploadedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    
    return res.status(201).json({
      id: document.id,
      name: document.name,
      uploadedBy: user.id,
      uploadDate: document.createdAt.toISOString().split('T')[0],
      sessionId: document.sessionId,
    });
  }
  
  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}

// pages/api/documents/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the authenticated user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get the document ID from the URL
  const documentId = req.query.id as string;
  
  // Get the user from the database to check permissions
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      role: true,
    },
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Handle GET request - fetch a specific document
  if (req.method === 'GET') {
    // Find the document
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        classroom: {
          include: {
            students: {
              where: {
                id: user.id,
              },
            },
            teachers: {
              where: {
                id: user.id,
              },
            },
          },
        },
      },
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if the user has access to the classroom
    if (
      document.classroom.students.length === 0 &&
      document.classroom.teachers.length === 0 &&
      user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Access denied to this document' });
    }
    
    // Fetch the document content using the sessionId
    try {
      // This would be an API call to your document processing service
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tts/process?session_id=${document.sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document content');
      }
      
      const documentContent = await response.json();
      
      return res.status(200).json(documentContent);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch document content' });
    }
  }
  
  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
}

// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the authenticated user session
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get the user from the database
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      disabilityType: true,
    },
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Return the user data
  return res.status(200).json(user);
}