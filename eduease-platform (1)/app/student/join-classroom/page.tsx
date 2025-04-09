// app/student/join-classroom/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Search, 
  School, 
  CheckCircle, 
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function JoinClassroomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [classCode, setClassCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading joined classrooms
  useState(() => {
    setTimeout(() => {
      setJoinedClassrooms([
        {
          id: "c1",
          name: "Grade 5 Mathematics",
          subject: "Mathematics",
          teacher: "Ms. Johnson",
          joinDate: "April 4, 2025"
        },
        {
          id: "c3",
          name: "Science Explorer",
          subject: "Science",
          teacher: "Mr. Rodriguez",
          joinDate: "April 2, 2025"
        },
      ]);
      setIsLoading(false);
    }, 1000);
  });

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    
    if (!classCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a classroom code",
      });
      return;
    }
    
    setIsJoining(true);
    
    try {
      // Here you would make an API call to join the classroom
      // For this example, we'll simulate a successful join
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if the code is valid (in a real app this would be checked by the API)
      if (classCode.length !== 6) {
        throw new Error("Invalid classroom code");
      }
      
      toast({
        title: "Joined classroom successfully",
        description: "You now have access to the classroom materials",
      });
      
      // Redirect to the student's dashboard or the classroom page
      router.push(`/student/dashboard`);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining classroom",
        description: error.message || "Please check the code and try again",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link 
        href="/student/dashboard" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Join Classroom Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <School className="h-5 w-5 mr-2 text-primary" />
              Join a Classroom
            </CardTitle>
            <CardDescription>Enter the code provided by your teacher</CardDescription>
          </CardHeader>
          <form onSubmit={handleJoinClassroom}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="classCode" className="text-sm font-medium">
                  Classroom Code
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="classCode"
                    placeholder="Enter 6-digit code"
                    className="pl-9"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Codes are 6 characters long and case-sensitive
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isJoining || !classCode.trim()}
              >
                {isJoining ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <School className="h-4 w-4 mr-2" />
                    Join Classroom
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Recently Joined Classrooms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Your Joined Classrooms
            </CardTitle>
            <CardDescription>
              Classrooms you've recently joined
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : joinedClassrooms.length > 0 ? (
              <div className="space-y-4">
                {joinedClassrooms.map((classroom) => (
                  <div key={classroom.id} className="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{classroom.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {classroom.subject} • {classroom.teacher}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined: {classroom.joinDate}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <School className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-medium">No classrooms joined yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a code to join your first classroom
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <School className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800">How to join a classroom?</h3>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal ml-4">
              <li>Ask your teacher for the classroom code</li>
              <li>Enter the 6-digit code in the field above</li>
              <li>Click "Join Classroom" to get access</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}