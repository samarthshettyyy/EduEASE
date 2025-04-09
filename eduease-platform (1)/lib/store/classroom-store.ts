// lib/store/classroom-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the classroom type
export interface Classroom {
  id: string
  name: string
  subject: string
  students: number
  color: string
  lastActive: string
  progress: number
  resources: number
  meetings: number
  status: string
}

// Define the store state
interface ClassroomState {
  classrooms: Classroom[]
  addClassroom: (classroom: Classroom) => void
  updateClassroom: (id: string, data: Partial<Classroom>) => void
  removeClassroom: (id: string) => void
}

// Sample initial data
const initialClassrooms: Classroom[] = [
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
    status: "active"
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
  },
  {
    id: "c4",
    name: "Social Studies",
    subject: "Social Studies",
    students: 20,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    lastActive: "1 week ago",
    progress: 45,
    resources: 8,
    meetings: 0,
    status: "inactive"
  },
  {
    id: "c5",
    name: "Art & Creativity",
    subject: "Art",
    students: 14,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    lastActive: "3 days ago",
    progress: 60,
    resources: 10,
    meetings: 1,
    status: "active"
  },
  {
    id: "c6",
    name: "Physical Education",
    subject: "PE",
    students: 24,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    lastActive: "4 days ago",
    progress: 50,
    resources: 6,
    meetings: 0,
    status: "archived"
  }
]

// Create the store with persistence
export const useClassroomStore = create<ClassroomState>()(
  persist(
    (set) => ({
      classrooms: initialClassrooms,
      
      // Add a new classroom
      addClassroom: (classroom) => 
        set((state) => ({
          classrooms: [...state.classrooms, classroom]
        })),
      
      // Update an existing classroom
      updateClassroom: (id, data) => 
        set((state) => ({
          classrooms: state.classrooms.map((classroom) => 
            classroom.id === id ? { ...classroom, ...data } : classroom
          )
        })),
      
      // Remove a classroom
      removeClassroom: (id) => 
        set((state) => ({
          classrooms: state.classrooms.filter((classroom) => classroom.id !== id)
        })),
    }),
    {
      name: 'classroom-storage', // Name for localStorage
    }
  )
)