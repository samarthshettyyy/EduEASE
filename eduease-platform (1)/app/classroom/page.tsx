"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mic,
  Volume2,
  Globe,
  Video,
  MessageSquare,
  Smile,
  ImageIcon,
  CuboidIcon as Cube,
  Send,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Hand,
  Bot,
  ArrowLeft,
  Plus,
  X,
  Upload,
  AlertCircle,
  LogOut,
  Loader,
  Eye,
  Download,
  CheckCircle,
  Clock
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"

// Import the DocumentViewer component
import DocumentViewer from "@/components/DocumentViewer"

// 3D Model Component
function Model(props) {
  // Use a placeholder or local model path
  const modelPath = "/assets/3d/Hand.glb";
  
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene} scale={2} {...props} />;
  } catch (error) {
    console.error("Error loading 3D model:", error);
    // Return a simple fallback
    return (
      <mesh {...props}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
}

// Emotion Detection Component
function EmotionDetector({ onEmotionDetected }) {
  const [isActive, setIsActive] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("neutral")

  // Simulate emotion detection
  useEffect(() => {
    if (!isActive) return

    const emotions = ["neutral", "happy", "confused", "overwhelmed", "engaged"]
    const interval = setInterval(() => {
      const emotion = emotions[Math.floor(Math.random() * emotions.length)]
      setCurrentEmotion(emotion)
      onEmotionDetected(emotion)
    }, 10000)

    return () => clearInterval(interval)
  }, [isActive, onEmotionDetected])

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Emotion Detection</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Toggle emotion detection" />
        </div>
        <CardDescription>Adapts content based on your emotional state</CardDescription>
      </CardHeader>
      {isActive && (
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Smile className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm">
                Current state: <span className="font-medium">{currentEmotion}</span>
              </p>
              {currentEmotion === "overwhelmed" && (
                <p className="text-xs text-muted-foreground mt-1">Content simplified to reduce cognitive load</p>
              )}
          </div>
                
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <VoiceNavigation onVoiceCommand={handleVoiceCommand}/>
            <SignLanguageConverter />
            
            {/* Telegram Bot Integration Component */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Telegram Bot</CardTitle>
                <CardDescription>Get updates and homework reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AdaptLearn Bot</p>
                    <p className="text-xs text-muted-foreground">Connect to receive notifications</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Connect to Telegram
                </Button>
              </CardFooter>
            </Card>

            {/* Chat Room (conditionally rendered) */}
            {showChat && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Class Chat</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-60 overflow-y-auto border rounded-md p-2 mb-2">
                    <div className="space-y-2">
                      <div className="bg-muted p-2 rounded-md">
                        <p className="text-xs font-medium">Teacher</p>
                        <p className="text-sm">Remember to complete the worksheet by Friday!</p>
                      </div>
                      <div className="bg-primary/10 p-2 rounded-md">
                        <p className="text-xs font-medium">Alex</p>
                        <p className="text-sm">Can we review the cell membrane again?</p>
                      </div>
                      <div className="bg-muted p-2 rounded-md">
                        <p className="text-xs font-medium">Teacher</p>
                        <p className="text-sm">Sure, let's go over it in tomorrow's class.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Call (conditionally rendered) */}
            {showVideo && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">1-on-1 Video Call</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowVideo(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mic className="h-4 w-4 mr-1" />
                      Mute
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      Camera
                    </Button>
                    <Button variant="destructive" size="sm">
                      End Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Completion Modal */}
      {showCompletionModal && selectedDocForCompletion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Mark "{selectedDocForCompletion.name}" as Completed</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share your understanding of this material to help your teacher improve future content.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">How well did you understand this material?</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={comprehensionLevel}
                onChange={(e) => setComprehensionLevel(e.target.value)}
              >
                <option value="excellent">Excellent - I understood everything</option>
                <option value="good">Good - I understood most of it</option>
                <option value="fair">Fair - I understood some parts</option>
                <option value="poor">Poor - I had difficulty understanding</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Feedback (optional)</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Share your thoughts about this document..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded-md"
                onClick={() => {
                  setShowCompletionModal(false);
                  setSelectedDocForCompletion(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md"
                onClick={submitDocumentCompletion}
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Dyslexia-Friendly Learning Platform • Created to help students with reading difficulties
          </p>
        </div>
      </footer>
    </div>
  )}
              {currentEmotion === "confused" && (
                <p className="text-xs text-muted-foreground mt-1">Additional explanations provided</p>
              )}
              {currentEmotion === "engaged" && (
                <p className="text-xs text-muted-foreground mt-1">Great job staying focused!</p>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Sign Language Converter Component
function SignLanguageConverter() {
  const [isActive, setIsActive] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Sign Language Converter</CardTitle>
          <Switch checked={isActive} onCheckedChange={setIsActive} aria-label="Toggle sign language converter" />
        </div>
        <CardDescription>Converts audio to sign language</CardDescription>
      </CardHeader>
      {isActive && (
        <CardContent className="flex justify-center">
          <div className="relative h-40 w-40 bg-muted rounded-lg flex items-center justify-center">
            <Hand className="h-20 w-20 text-muted-foreground" />
            <div className="absolute bottom-2 left-2 right-2 bg-background/80 rounded p-1">
              <p className="text-xs text-center">Sign language avatar active</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Voice Recognition Component
function VoiceNavigation({ onVoiceCommand }: { onVoiceCommand: (command: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");

  const toggleListening = () => {
    if (!isListening) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setCommand(transcript);

        // Trigger action in parent
        onVoiceCommand(transcript);

        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      setIsListening(false);
      setCommand("");
    }
  };

  function playBeep() {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
  
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0.2, context.currentTime); // volume
  
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
  
    oscillator.start();
    oscillator.stop(context.currentTime + 0.15); // short beep
  }  

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent spacebar from scrolling
      if (event.code === "Space") {
        event.preventDefault();
        if (!isListening) playBeep();
        toggleListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isListening]);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Voice Navigation</CardTitle>
        <CardDescription>Navigate using voice commands</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            onClick={toggleListening}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            {isListening ? "Listening..." : "Start Listening"}
          </Button>
          {command && (
            <p className="text-sm">
              Command detected: <span className="font-medium">{command}</span>
            </p>
          )}
        </div>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Try saying: "read aloud", "next page", "go to chapter 3"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Document List Component
function DocumentList({ documents, isLoading, userRole, onSelectDocument, onMarkAsCompleted }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Classroom Documents</CardTitle>
        <CardDescription>
          {userRole === "teacher" 
            ? "Documents you've shared with students" 
            : "Learning materials shared by your teacher"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted cursor-pointer"
              >
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => onSelectDocument(doc.id)}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Uploaded by {doc.uploadedBy} on {doc.uploadDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userRole === "student" && (
                    <>
                      {doc.completed ? (
                        <div className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </div>
                      ) : doc.viewed ? (
                        <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Viewed
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-amber-50 text-amber-600 text-xs rounded-full flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          New
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectDocument(doc.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>

                    {userRole === "student" && !doc.completed && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsCompleted(doc.id);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No documents available yet</p>
            {userRole === "teacher" && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <input
                    type="file"
                    id="file-upload-empty"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.txt,.docx"
                    onChange={(e) => handleFileUpload(e)}
                  />
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Classroom Page Component
export default function ClassroomPage() {
  const params = useParams()
  const router = useRouter()
  const classroomId = params?.id
  const [activeTab, setActiveTab] = useState("content")
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [showChat, setShowChat] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [documentData, setDocumentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [processingError, setProcessingError] = useState(null)
  const [isReading, setIsReading] = useState(false)
  const [userRole, setUserRole] = useState("student") // Default to student
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [classroomDocuments, setClassroomDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  
  // States for document completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [selectedDocForCompletion, setSelectedDocForCompletion] = useState(null)
  const [comprehensionLevel, setComprehensionLevel] = useState("good")
  const [feedback, setFeedback] = useState("")

  // Fetch user role and classroom documents on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // This would be an API call to get the user's role from your auth system
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (response.ok) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // For demo, we could default to student role if there's an error
      }
    };

    const fetchClassroomDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        // This would be an API call to get documents for this classroom
        const response = await fetch(`/api/classrooms/${classroomId}/documents`);
        const data = await response.json();
        
        if (response.ok) {
          const formattedDocs = data.documents.map(doc => ({
            id: doc.id,
            name: doc.title,
            uploadedBy: doc.teacherName || "Teacher",
            uploadDate: new Date(doc.createdAt).toISOString().split('T')[0],
            viewed: doc.viewed,
            completed: doc.completed,
            fileUrl: doc.fileUrl
          }));
          
          setClassroomDocuments(formattedDocs);
        }
      } catch (error) {
        console.error('Error fetching classroom documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchUserData();
    fetchClassroomDocuments();
    
    // For demonstration, simulating API responses
    setTimeout(() => {
      // Uncomment one of these to test different roles
      // setUserRole("teacher"); // To test teacher view
      // setUserRole("student"); // To test student view
      
      setIsLoadingDocuments(false);
      setClassroomDocuments([
        { id: 1, name: "Cell Structure Introduction.pdf", uploadedBy: "Ms. Johnson", uploadDate: "2025-04-02", viewed: false, completed: false },
        { id: 2, name: "Biology Chapter 3 Notes.docx", uploadedBy: "Mr. Smith", uploadDate: "2025-04-05", viewed: true, completed: false }
      ]);
    }, 1000);
  }, [classroomId]);

  const handleVoiceCommand = (cmd: string) => {
    if (cmd.includes("read aloud")) {
      setIsReading(true); // Toggle reading
    }

    if (cmd.includes("stop reading")) {
      setIsReading(false); // Toggle reading
    }
  };

  // Simulated content adaptation based on emotion
  const [contentLevel, setContentLevel] = useState("standard")
  const [encouragementMessage, setEncouragementMessage] = useState("")

  const handleEmotionDetected = (emotion) => {
    if (emotion === "overwhelmed") {
      setContentLevel("simplified")
      setEncouragementMessage("You're doing great! Take your time.")
    } else if (emotion === "confused") {
      setContentLevel("detailed")
      setEncouragementMessage("It's okay to be confused. Let's break this down.")
    } else if (emotion === "happy" || emotion === "engaged") {
      setContentLevel("standard")
      setEncouragementMessage("Excellent work! Keep it up!")
    } else {
      setContentLevel("standard")
      setEncouragementMessage("")
    }
  }

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Call your logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push('/login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // File upload and document loading function
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file type is allowed
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'pdf', 'docx'].includes(fileType || '')) {
      alert('Invalid file type. Please upload PDF, TXT, or DOCX files.');
      return;
    }

    setIsLoading(true);
    setProcessingError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classroomId', classroomId as string);
      formData.append('title', file.name);

      // Make API call to upload the document
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error uploading document');
      }
      
      const data = await response.json();
      
      // Store the document data
      setDocumentData({
        sessionId: data.id,
        filename: file.name,
        text: "Document uploaded successfully. Content will be available for viewing.",
        sentences: ["Document uploaded successfully. Content will be available for viewing."],
        importantWords: [],
        extractionStats: {
          extraction_method: "upload",
          character_count: 0,
          word_count: 0,
          is_empty: false
        }
      });
      
      // Add the new document to the classroom documents list
      const newDocument = {
        id: data.id,
        name: file.name,
        uploadedBy: "You",
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        viewed: false,
        completed: false
      };
      
      setClassroomDocuments([
        newDocument,
        ...classroomDocuments
      ]);
      
      setIsLoading(false);
      setActiveTab("content");
    } catch (error) {
      console.error('Error processing file:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error processing file');
      setIsLoading(false);
    }
  };

  // Load a document from the classroom document list
  const loadDocument = async (documentId) => {
    setIsLoading(true);
    setProcessingError(null);
    
    try {
      // Find the document in the classroom documents
      const selectedDoc = classroomDocuments.find(doc => doc.id === documentId);
      setSelectedDocument(selectedDoc);
      
      // Mark as viewed if user is a student
      if (userRole === "student" && !selectedDoc.viewed) {
        try {
          await fetch('/api/documents/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              documentId, 
              viewed: true 
            })
          });
          
          // Update local state
          setClassroomDocuments(docs => 
            docs.map(doc => 
              doc.id === documentId 
                ? { ...doc, viewed: true } 
                : doc
            )
          );
        } catch (error) {
          console.error('Error marking document as viewed:', error);
        }
      }
      
      // In a real implementation, you would fetch the document content from your API
      const response = await fetch(`/api/documents/${documentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load document');
      }
      
      const data = await response.json();
      
      // Store the document data
      setDocumentData({
        sessionId: data.sessionId || `doc-${documentId}`,
        filename: selectedDoc.name,
        text: data.text || "Sample document content for demonstration purposes.",
        sentences: data.sentences || ["Sample document content for demonstration purposes."],
        importantWords: data.importantWords || ["sample", "document", "content"],
        extractionStats: data.extractionStats || {
          extraction_method: "demo",
          character_count: 45,
          word_count: 6,
          is_empty: false
        }
      });
      
      setIsLoading(false);
      setActiveTab("content");
    } catch (error) {
      console.error('Error loading document:', error);
      // For demonstration, create mock document data
      setDocumentData({
        sessionId: `doc-${documentId}`,
        filename: classroomDocuments.find(doc => doc.id === documentId)?.name || "Document",
        text: "This is sample content for the selected document. In a real implementation, this would be fetched from your API.",
        sentences: [
          "This is sample content for the selected document.",
          "In a real implementation, this would be fetched from your API."
        ],
        importantWords: ["sample", "content", "document", "implementation", "API"],
        extractionStats: {
          extraction_method: "demo",
          character_count: 114,
          word_count: 21,
          is_empty: false
        }
      });
      setIsLoading(false);
      setActiveTab("content");
    }
  };

  // Handle marking a document as completed
  const handleMarkAsCompleted = (documentId) => {
    const document = classroomDocuments.find(doc => doc.id === documentId);
    if (document) {
      setSelectedDocForCompletion(document);
      setShowCompletionModal(true);
    }
  };

  // Handle submitting document completion
  const submitDocumentCompletion = async () => {
    if (!selectedDocForCompletion) return;
    
    try {
      await fetch('/api/documents/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentId: selectedDocForCompletion.id,
          viewed: true,
          completed: true,
          feedback,
          comprehension: comprehensionLevel
        })
      });
      
      // Update local state
      setClassroomDocuments(docs => 
        docs.map(doc => 
          doc.id === selectedDocForCompletion.id 
            ? { ...doc, viewed: true, completed: true } 
            : doc
        )
      );
      
      // Reset and close modal
      setShowCompletionModal(false);
      setSelectedDocForCompletion(null);
      setFeedback("");
      setComprehensionLevel("good");
    } catch (error) {
      console.error('Error marking document as completed:', error);
    }
  };

  // Sample content for the reader (used when no document is uploaded)
  const sampleContent = `Cells are the basic structural and functional units of all living organisms. They are often called the "building blocks of life." The study of cells is called cell biology.

  Each cell contains specialized structures called organelles that perform specific functions. The two main types of cells are prokaryotic and eukaryotic cells.

  The cell membrane is a thin layer that surrounds the cell and separates its contents from the outside environment. It's made of a phospholipid bilayer with embedded proteins.

  The membrane is selectively permeable, meaning it allows some substances to pass through while blocking others. This property is essential for maintaining the cell's internal environment.`

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-muted" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-lg font-medium">Biology 101</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Only show file upload button for teachers */}
            {userRole === "teacher" && (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
                <Button variant="outline" size="sm" className="flex items-center gap-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            )}
            
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-[130px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setShowChat(!showChat)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowVideo(!showVideo)}>
              <Video className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Chapter 3: Cell Structure</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {encouragementMessage && (
              <div className="bg-primary/10 text-primary rounded-lg p-3 text-sm">{encouragementMessage}</div>
            )}

            {isLoading && (
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Processing your document...</p>
                </div>
              </Card>
            )}

            {/* Classroom Documents Section - Show documents when no specific document is loaded */}
            {!isLoading && !documentData && (
              <DocumentList
                documents={classroomDocuments}
                isLoading={isLoadingDocuments}
                userRole={userRole}
                onSelectDocument={loadDocument}
                onMarkAsCompleted={handleMarkAsCompleted}
              />
            )}

            {!isLoading && (documentData || activeTab !== "content") && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="interactive">Interactive</TabsTrigger>
                  <TabsTrigger value="3d-models">3D Models</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  {processingError ? (
                    // Show error message if processing failed
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Error Processing Document</h3>
                        <p className="text-sm text-muted-foreground mb-4">{processingError}</p>
                        <Button variant="outline" onClick={() => setProcessingError(null)}>
                          Try Again
                        </Button>
                      </CardContent>
                    </Card>
                  ) : documentData ? (
                    // When document data is available, show the DocumentViewer
                    <DocumentViewer 
                      sessionId={documentData.sessionId}
                      filename={documentData.filename}
                      text={documentData.text}
                      sentences={documentData.sentences}
                      initialImportantWords={documentData.importantWords}
                      extractionStats={documentData.extractionStats}
                      isReadingProp={isReading}
                    />
                  ) : (
                    // This shouldn't be visible now that we have the classroom documents section
                    <Card className="border-dashed border-2 border-gray-300">
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <div className="mb-4 text-muted-foreground">
                          <BookOpen className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          Please select a document from the classroom documents list.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="interactive" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Interactive Cell Explorer</CardTitle>
                      <CardDescription>Click on different parts of the cell to learn more</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center">
                          <Volume2 className="h-8 w-8 text-primary mb-2" />
                          <h4 className="font-medium text-sm mb-1">Audio</h4>
                          <p className="text-xs text-center text-muted-foreground">Listen to cell processes</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Play className="h-3 w-3 mr-1" /> Play
                          </Button>
                        </div>

                        <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center">
                          <ImageIcon className="h-8 w-8 text-primary mb-2" />
                          <h4 className="font-medium text-sm mb-1">Visual</h4>
                          <p className="text-xs text-center text-muted-foreground">Watch cell animations</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Play className="h-3 w-3 mr-1" /> View
                          </Button>
                        </div>

                        <div className="bg-primary/10 rounded-lg p-4 flex flex-col items-center">
                          <Cube className="h-8 w-8 text-primary mb-2" />
                          <h4 className="font-medium text-sm mb-1">Tactile</h4>
                          <p className="text-xs text-center text-muted-foreground">Interactive cell building</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <Play className="h-3 w-3 mr-1" /> Start
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="Interactive cell diagram"
                            className="max-w-full max-h-full"
                          />
                          {/* Interactive hotspots would be placed here */}
                          <div className="absolute top-1/4 left-1/2 h-4 w-4 bg-primary rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-1/3 h-4 w-4 bg-primary rounded-full animate-pulse" />
                          <div className="absolute bottom-1/3 right-1/4 h-4 w-4 bg-primary rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-sm">Click on a highlighted area to learn more about that cell component.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Multisensory Learning Activity</CardTitle>
                      <CardDescription>Engage with content through multiple senses</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>

                <TabsContent value="3d-models" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>3D Cell Model</CardTitle>
                      <CardDescription>Interact with a 3D model of a cell</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <Canvas>
                          <ambientLight intensity={0.5} />
                          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                          <Model position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} />
                          <OrbitControls />
                          <Environment preset="studio" />
                        </Canvas>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          View Nucleus
                        </Button>
                        <Button variant="outline" size="sm">
                          View Mitochondria
                        </Button>
                        <Button variant="outline" size="sm">
                          View Cell Membrane
                        </Button>
                        <Button variant="outline" size="sm">
                          View Golgi Apparatus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chapter Quiz</CardTitle>
                      <CardDescription>Test your knowledge of cell structure</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="font-medium">Question 1</h3>
                          <p className="text-sm">What is the main function of the cell membrane?</p>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q1a" name="q1" className="h-4 w-4" />
                              <label htmlFor="q1a" className="text-sm">
                                Energy production
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q1b" name="q1" className="h-4 w-4" />
                              <label htmlFor="q1b" className="text-sm">
                                Protein synthesis
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q1c" name="q1" className="h-4 w-4" />
                              <label htmlFor="q1c" className="text-sm">
                                Control what enters and exits the cell
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q1d" name="q1" className="h-4 w-4" />
                              <label htmlFor="q1d" className="text-sm">
                                DNA storage
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium">Question 2</h3>
                          <p className="text-sm">Which organelle is known as the "powerhouse of the cell"?</p>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q2a" name="q2" className="h-4 w-4" />
                              <label htmlFor="q2a" className="text-sm">
                                Nucleus
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q2b" name="q2" className="h-4 w-4" />
                              <label htmlFor="q2b" className="text-sm">
                                Mitochondria
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q2c" name="q2" className="h-4 w-4" />
                              <label htmlFor="q2c" className="text-sm">
                                Ribosome
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id="q2d" name="q2" className="h-4 w-4" />
                              <label htmlFor="q2d" className="text-sm">
                                Golgi apparatus
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button className="mt-6 w-full">Submit Answers</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}