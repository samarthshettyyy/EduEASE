"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DocumentViewer  from "./components/DocumentViewer"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Box } from "@react-three/drei"
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Globe,
  Loader,
  LogOut,
  MessageSquare,
  Upload,
  Video,
  AlertCircle
} from "lucide-react"

// Import our split components
import EmotionDetector from "./components/EmotionDetector"
import VoiceNavigation from "./components/VoiceNavigation"
import SignLanguageConverter from "./components/SignLanguageConverter"
import TelegramBot from "./components/TelegramBot"
import DocumentList from "./components/DocumentList"
import ChatRoom from "./components/ChatRoom"
import VideoCall from "./components/VideoCall"
import CompletionModal from "./components/CompletionModal"

// Define the Model3D component to avoid the undefined error
function Model3D(props) {
  return (
    <group {...props}>
      {/* Simple cell model made with basic shapes */}
      <Box args={[2, 2, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#7dd3fc" opacity={0.7} transparent />
      </Box>
      {/* Nucleus */}
      <Box args={[0.8, 0.8, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0369a1" />
      </Box>
      {/* Other cell organelles could be added here */}
    </group>
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

  // State for content adaptation
  const [contentLevel, setContentLevel] = useState("standard")
  const [encouragementMessage, setEncouragementMessage] = useState("")

  // Fetch user role and classroom documents on component mount
  useEffect(() => {
    // Fetch logic here...
    // Using setTimeout to simulate API call for the demo
    setTimeout(() => {
      setIsLoadingDocuments(false)
      setClassroomDocuments([
        { id: 1, name: "Cell Structure Introduction.pdf", uploadedBy: "Ms. Johnson", uploadDate: "2025-04-02", viewed: false, completed: false },
        { id: 2, name: "Biology Chapter 3 Notes.docx", uploadedBy: "Mr. Smith", uploadDate: "2025-04-05", viewed: true, completed: false }
      ])
    }, 1000)
  }, [classroomId])

  const handleVoiceCommand = (cmd) => {
    if (cmd.includes("read aloud")) {
      setIsReading(true) // Toggle reading
    }

    if (cmd.includes("stop reading")) {
      setIsReading(false) // Toggle reading
    }
  }

  // Simulated content adaptation based on emotion
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
      formData.append('classroomId', classroomId);
      formData.append('title', file.name);

      // API call logic here...
      setTimeout(() => {
        // Simulate successful upload
        const newDocument = {
          id: Date.now(),
          name: file.name,
          uploadedBy: "You",
          uploadDate: new Date().toISOString().split('T')[0],
          viewed: false,
          completed: false
        };
        
        setClassroomDocuments([newDocument, ...classroomDocuments]);
        setIsLoading(false);
        setActiveTab("content");
      }, 1500);
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
      
      // Mock document content
      setTimeout(() => {
        setDocumentData({
          sessionId: `doc-${documentId}`,
          filename: selectedDoc.name,
          text: "This is sample content for the selected document. In a real implementation, this would be fetched from your API.",
          sentences: [
            "Mitochondria are membrane-bound cell organelles found in the cells of most eukaryotes, including animals, plants, and fungi.",
            "They generate most of the chemical energy needed to power the cell's biochemical reactions by producing adenosine triphosphate (ATP) through a process called oxidative phosphorylation."
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
      }, 1000);
    } catch (error) {
      console.error('Error loading document:', error);
      setIsLoading(false);
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
      // Mock API call
      setTimeout(() => {
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
      }, 500);
    } catch (error) {
      console.error('Error marking document as completed:', error);
    }
  };

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

            {/* Classroom Documents Section */}
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
                      <div className="flex flex-col items-center justify-center py-8 text-center p-6">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Error Processing Document</h3>
                        <p className="text-sm text-muted-foreground mb-4">{processingError}</p>
                        <Button variant="outline" onClick={() => setProcessingError(null)}>
                          Try Again
                        </Button>
                      </div>
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
                  ) : null}
                </TabsContent>

                <TabsContent value="3d-models" className="space-y-4">
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-2">3D Cell Model</h3>
                      <p className="text-sm text-muted-foreground mb-4">Interact with a 3D model of a cell</p>
                      
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <Canvas>
                          <ambientLight intensity={0.5} />
                          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                          <Model3D position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} />
                          <OrbitControls />
                          <Environment preset="studio" />
                        </Canvas>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                {/* Other tab contents would go here */}
              </Tabs>
            )}
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <VoiceNavigation onVoiceCommand={handleVoiceCommand} />
            <SignLanguageConverter />
            <TelegramBot />
            
            {/* Conditionally rendered components */}
            {showChat && <ChatRoom onClose={() => setShowChat(false)} />}
            {showVideo && <VideoCall onClose={() => setShowVideo(false)} />}
          </div>
        </div>
      </main>

      {/* Completion Modal */}
      <CompletionModal
        showModal={showCompletionModal}
        selectedDoc={selectedDocForCompletion}
        comprehensionLevel={comprehensionLevel}
        feedback={feedback}
        setShowModal={setShowCompletionModal}
        setSelectedDoc={setSelectedDocForCompletion}
        setComprehensionLevel={setComprehensionLevel}
        setFeedback={setFeedback}
        onSubmit={submitDocumentCompletion}
      />

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Dyslexia-Friendly Learning Platform • Created to help students with reading difficulties
          </p>
        </div>
      </footer>
    </div>
  )
}