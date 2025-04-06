"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"

// 3D Model Component
function Model(props) {
  const { scene } = useGLTF("/assets/3d/Hand.glb")
  return <primitive object={scene} scale={2} {...props} />
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
function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false)
  const [command, setCommand] = useState("")

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setCommand("next page")
        setIsListening(false)
      }, 3000)
    } else {
      setCommand("")
    }
  }

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
          <p className="text-xs text-muted-foreground">Try saying: "next page", "previous page", "go to chapter 3"</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Telegram Bot Integration Component
function TelegramBotIntegration() {
  return (
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
  )
}

export default function ClassroomPage() {
  const params = useParams()
  const classroomId = params.id
  const [activeTab, setActiveTab] = useState("content")
  const [readingVoice, setReadingVoice] = useState("female")
  const [readingSpeed, setReadingSpeed] = useState([1])
  const [isReading, setIsReading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("english")
  const [showChat, setShowChat] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

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

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="interactive">Interactive</TabsTrigger>
                <TabsTrigger value="3d-models">3D Models</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>Text-to-Speech Reader</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsReading(!isReading)}>
                          {isReading ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                          {isReading ? "Pause" : "Read Aloud"}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>Customize your reading experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Voice Type</label>
                        <Select value={readingVoice} onValueChange={setReadingVoice}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male Voice</SelectItem>
                            <SelectItem value="female">Female Voice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Reading Speed</label>
                        <div className="flex items-center gap-4">
                          <RotateCcw className="h-4 w-4 text-muted-foreground" />
                          <Slider value={readingSpeed} onValueChange={setReadingSpeed} min={0.5} max={2} step={0.1} />
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Current: {readingSpeed[0]}x</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <img
                            src="/placeholder.svg?height=200&width=300"
                            alt="Cell structure diagram"
                            className="rounded-lg w-full h-auto object-cover"
                          />
                        </div>
                        <div className="w-2/3">
                          <h3 className="text-lg font-medium mb-2">Introduction to Cells</h3>
                          <p className="text-sm mb-2">
                            Cells are the basic structural and functional units of all living organisms. They are often
                            called the "building blocks of life." The study of cells is called{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              cell biology
                            </span>
                            .
                          </p>
                          <p className="text-sm">
                            Each cell contains specialized structures called{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              organelles
                            </span>{" "}
                            that perform specific functions. The two main types of cells are{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              prokaryotic
                            </span>{" "}
                            and{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              eukaryotic
                            </span>{" "}
                            cells.
                          </p>

                          {contentLevel === "detailed" && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md">
                              <p className="text-xs text-blue-700">
                                <strong>Additional explanation:</strong> Prokaryotic cells are simpler and lack a
                                nucleus, while eukaryotic cells have a nucleus and more complex organelles. Your body is
                                made up of eukaryotic cells!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-2/3">
                          <h3 className="text-lg font-medium mb-2">Cell Membrane</h3>
                          <p className="text-sm mb-2">
                            The{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              cell membrane
                            </span>{" "}
                            is a thin layer that surrounds the cell and separates its contents from the outside
                            environment. It's made of a{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              phospholipid bilayer
                            </span>{" "}
                            with embedded proteins.
                          </p>
                          <p className="text-sm">
                            The membrane is{" "}
                            <span className={contentLevel === "simplified" ? "bg-yellow-100 px-1" : "font-medium"}>
                              selectively permeable
                            </span>
                            , meaning it allows some substances to pass through while blocking others. This property is
                            essential for maintaining the cell's internal environment.
                          </p>

                          {contentLevel === "simplified" && (
                            <div className="mt-2 p-2 bg-green-50 rounded-md">
                              <p className="text-xs text-green-700">
                                <strong>Simplified:</strong> Think of the cell membrane like the walls of your house. It
                                protects what's inside and controls what goes in and out.
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="w-1/3">
                          <img
                            src="/placeholder.svg?height=200&width=300"
                            alt="Cell membrane structure"
                            className="rounded-lg w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interactive" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Cell Explorer</CardTitle>
                    <CardDescription>Click on different parts of the cell to learn more</CardDescription>
                  </CardHeader>
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
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <EmotionDetector onEmotionDetected={handleEmotionDetected} />
            <VoiceNavigation />
            <SignLanguageConverter />
            <TelegramBotIntegration />

            {/* Chat Room (conditionally rendered) */}
            {showChat && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Class Chat</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                      <VolumeX className="h-4 w-4" />
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
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 text-sm border rounded-md"
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
                      <VolumeX className="h-4 w-4" />
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
    </div>
  )
}

