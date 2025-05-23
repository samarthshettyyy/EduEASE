"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DocumentViewer from "../components/DocumentViewer"
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
  AlertCircle,
  FileText,
  CloudCog
} from "lucide-react"

// Import our split components
import EmotionDetector from "../components/EmotionDetector"
import VoiceNavigation from "../components/VoiceNavigation"
import SignLanguageConverter from "../components/SignLanguageConverter"
import TelegramBot from "../components/TelegramBot"
import DocumentList from "../components/DocumentList"
import ChatRoom from "../components/ChatRoom"
import VideoCall from "../components/VideoCall"
import CompletionModal from "../components/CompletionModal"
import AccessibilityMenu from "../components/AccessibilityMenu"
import AIQuizGenerator from "../components/AIQuizGenerator"
import TalkToPDF from "../components/TalkToPDF"

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

interface Classroom {
  id: number;
  name: string;
  description: string;
  subject: string;
  room_code: string;
  created_at: string;
  teacher_name: string;
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
  const [modules, setModules] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  // States for document completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [selectedDocForCompletion, setSelectedDocForCompletion] = useState(null)
  const [comprehensionLevel, setComprehensionLevel] = useState("good")
  const [feedback, setFeedback] = useState("")

  // State for content adaptation
  const [contentLevel, setContentLevel] = useState("standard")
  const [encouragementMessage, setEncouragementMessage] = useState("")

  // Fetch user role and classroom documents on component mount
  const fetchModules = async (classroomId) => {
    try {
      const response = await fetch(`/api/teacher/modules?classroom_id=${classroomId}`);
      const data = await response.json();

      if (response.ok) {
        return data.modules; // Return modules if the request is successful
      } else {
        console.error('Error fetching modules:', data.message || 'Unknown error');
        return []; // Return an empty array if no modules are found
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      return []; // Return an empty array if there is a network or server error
    }
  };

  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      const fetchedModules = await fetchModules(classroomId);
      setClassroomDocuments(fetchedModules);
      setModules(fetchedModules);
      setIsLoading(false);
      setIsLoadingDocuments(false);
    };

    loadModules();
  }, [classroomId]);

  const handleVoiceCommand = (cmd) => {
    if (cmd.includes("read aloud")) {
      setIsReading(true) // Toggle reading
    }

    if (cmd.includes("stop reading")) {
      setIsReading(false) // Toggle reading
    }
  }

  // Simulated content adaptation based on emotion

  const handleEmotionDetected = (emotion: string) => {
    console.log("Detected Emotion:", emotion)
    // Add logic to adapt content here if needed
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
  // Function to load module content when selected from DocumentList
  const loadDocument = async (documentId) => {
    setIsLoading(true);
    setProcessingError(null);

    console.warn(documentId);

    try {
      // Find the selected module in the modules array for metadata
      const selectedDoc = modules.find(doc => doc.id === documentId);
      if (!selectedDoc) {
        throw new Error('Module not found in available modules');
      }

      setSelectedDocument(selectedDoc);

      // Fetch the module content from the API
      const response = await fetch(`/api/module-content/${documentId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch module: ${response.statusText}`);
      }

      const moduleData = await response.json();

      // Content level adaptation logic (if implemented)
      let contentToShow = moduleData.content;
      if (contentLevel === "simplified" && moduleData.simplifiedContent) {
        contentToShow = moduleData.simplifiedContent;
      } else if (contentLevel === "detailed" && moduleData.detailedContent) {
        contentToShow = moduleData.detailedContent;
      }

      // Prepare the data in the format expected by DocumentViewer
      setDocumentData({
        sessionId: `module-${documentId}`,
        filename: selectedDoc.name || moduleData.title,
        text: contentToShow,
        sentences: moduleData.sentences ||
          (contentToShow?.split(/(?<=[.!?])\s+/) || []).filter(s => s.trim()),
        initialImportantWords: moduleData.keywords || [],
        extractionStats: moduleData.stats || {
          extraction_method: "api",
          character_count: contentToShow?.length || 0,
          word_count: contentToShow?.split(/\s+/).length || 0,
          is_empty: !contentToShow
        }
      });

      // Update UI state
      setIsLoading(false);
      setActiveTab("content");

      // Track module view (optional analytics)
      // logModuleView(user.id, classroomId, documentId);

    } catch (error) {
      console.error('Error loading module:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error loading module');
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

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loadingRoomData, setLoadingRoomData] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await fetch(`/api/classrooms/room-data?id=${classroomId}`);
        const data = await res.json();
        setClassroom(data.classroom[0]);
        console.warn(data.classroom);
      } catch (error) {
        console.error("Error fetching classroom:", error);
      } finally {
        setLoadingRoomData(false);
      }
    };

    fetchClassroom();
  }, [classroomId]);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) return

      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)

      window.googleTranslateElementInit = () => {
        if (!document.getElementById('google_translate_element')?.innerHTML) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,fr,es,de,hi,gu,ja',
              layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            },
            'google_translate_element'
          )
        }
      }
    }
    addGoogleTranslateScript()
  }, [])

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
              {!loadingRoomData && classroom && (
                <div>
                  <span className="text-lg font-medium">{classroom.name}&nbsp;</span>
                  <span className="text-gray-400"> by {classroom.teacher_name}</span>
                </div>
              )}
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

            <Button variant="outline" onClick={() => setDocumentData(null)}>
              <FileText />Modules
            </Button>
            <Button variant="outline"><div id="google_translate_element"></div></Button>
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
                documents={modules}
                isLoading={isLoadingDocuments}
                userRole={userRole}
                onSelectDocument={loadDocument}
                onMarkAsCompleted={handleMarkAsCompleted}
              />
            )}

            {!isLoading && (documentData || activeTab !== "content") && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="interactive">Interactive</TabsTrigger>
                  <TabsTrigger value="3d-models">3D Models</TabsTrigger>
                  <TabsTrigger value="talk">Talk to PDF</TabsTrigger>
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
                <TabsContent value="quiz" className="space-y-4">
                  {documentData ? (
                    <AIQuizGenerator
                      documentText={documentData.text}
                      documentTitle={documentData.filename}
                      numberOfQuestions={5}
                      difficulty="medium"
                      onQuizComplete={(score, total) => {
                        // Optional: You can track quiz completion here
                        console.log(`Quiz completed with score ${score}/${total}`);

                        // Optional: Update the user's progress
                        if (selectedDocument && score >= total * 0.7) {
                          const updatedDocs = classroomDocuments.map(doc =>
                            doc.id === selectedDocument.id
                              ? { ...doc, quizCompleted: true }
                              : doc
                          );
                          setClassroomDocuments(updatedDocs);
                        }
                      }}
                    />
                  ) : (
                    <Card>

                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="talk" className="space-y-4">
                  {documentData ? (
                    <TalkToPDF
                      documentText={documentData.text}
                      documentTitle={documentData.filename}
                      documentId={documentData.sessionId}
                    />
                  ) : (
                    <Card>
                      <div className="flex flex-col items-center justify-center py-8 text-center p-6">
                        <CloudOff className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Please open a document to start asking questions.
                        </p>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Conditionally rendered components */}
            {showChat && <ChatRoom onClose={() => setShowChat(false)} />}
            {showVideo && <VideoCall userId={user.id} onClose={() => setShowVideo(false)} />}
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <VoiceNavigation onVoiceCommand={handleVoiceCommand} />
            <SignLanguageConverter />
            <TelegramBot />
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

      <footer className="bg-black border-t border-gray-400 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-white">
            © 2025 EduEase™ &nbsp;•&nbsp; All Rights Reserved &nbsp;•&nbsp; Created to help students with special needs
          </p>
        </div>
      </footer>

      <AccessibilityMenu />
    </div>
  )
}