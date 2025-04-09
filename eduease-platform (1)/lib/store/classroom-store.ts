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

// Generate a random 6-character alphanumeric code
const generateClassroomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
};

// Create the store with persistence
export const useClassroomStore = create<ClassroomState>()(
  persist(
    (set, get) => ({
      classrooms: [],
      
      addClassroom: (classroom) => {
        const classroomWithCode = {
          ...classroom,
          code: generateClassroomCode()
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