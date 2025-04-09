// lib/store/classroom-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  students: number;
  color: string;
  lastActive: string;
  progress: number;
  resources: number;
  meetings: number;
  status: string;
  code?: string;
  description?: string;
  grade?: string;
  teacherId?: string;
}

interface ClassroomState {
  classrooms: Classroom[];
  addClassroom: (classroom: Classroom) => Classroom;
  updateClassroom: (id: string, data: Partial<Classroom>) => void;
  removeClassroom: (id: string) => void;
  getClassroomByCode: (code: string) => Classroom | undefined;
}

// Create the store with persistence
export const useClassroomStore = create<ClassroomState>()(
  persist(
    (set, get) => ({
      classrooms: [
        // Default classrooms that show up before user adds any
        {
          id: "c1",
          name: "Grade 5 Mathematics",
          subject: "Mathematics",
          students: 18,
          color: "bg-blue-100 text-blue-800 border-blue-200",
          lastActive: "Today",
          progress: 75,
          resources: 12,
          meetings: 3,
          status: "active",
          code: "L4JP4L"
        },
        {
          id: "c2",
          name: "Reading & Comprehension",
          subject: "English",
          students: 22,
          color: "bg-green-100 text-green-800 border-green-200",
          lastActive: "Yesterday",
          progress: 68,
          resources: 18,
          meetings: 2,
          status: "active"
        },
        {
          id: "c3",
          name: "Science Explorer",
          subject: "Science",
          students: 16,
          color: "bg-purple-100 text-purple-800 border-purple-200",
          lastActive: "2 days ago",
          progress: 82,
          resources: 15,
          meetings: 1,
          status: "active"
        }
      ],
      
      addClassroom: (classroom) => {
        // If a code is not provided, generate one
        const classroomWithCode = {
          ...classroom,
          code: classroom.code || generateClassroomCode()
        };
        
        set((state) => ({
          classrooms: [...state.classrooms, classroomWithCode]
        }));
        
        return classroomWithCode;
      },
      
      updateClassroom: (id, data) => {
        set((state) => ({
          classrooms: state.classrooms.map((classroom) =>
            classroom.id === id ? { ...classroom, ...data } : classroom
          )
        }));
      },
      
      removeClassroom: (id) => {
        set((state) => ({
          classrooms: state.classrooms.filter((classroom) => classroom.id !== id)
        }));
      },
      
      getClassroomByCode: (code) => {
        return get().classrooms.find(classroom => classroom.code === code);
      }
    }),
    {
      name: 'classroom-storage',
    }
  )
);

// Helper function to generate a random 6-character alphanumeric code
const generateClassroomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};