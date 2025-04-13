// FRONTEND FIX: VideoCall.tsx
// Focus on fixing the video display issues

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, X, PhoneOff, Copy, Phone } from "lucide-react"
import { io, Socket } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface VideoCallProps {
  onClose: () => void;
  userId: string; // Current user's ID
}

export function VideoCall({ onClose, userId }: VideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [currentRoomId, setCurrentRoomId] = useState<string>(`room-${Math.random().toString(36).substring(2, 9)}`)
  const [joinRoomId, setJoinRoomId] = useState<string>("")
  const [isWaiting, setIsWaiting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [showCallSetup, setShowCallSetup] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState({title: "", description: ""})
  const [connectionState, setConnectionState] = useState<string>("")
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const socketRef = useRef<Socket | null>(null)
  
  // Initialize socket connection and local stream
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || "http://localhost:3001")
    socketRef.current = socket
    
    // Socket event listeners
    socket.on("connect", () => {
      console.log("Connected to signaling server")
    })
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setConnectionError("Failed to connect to signaling server")
    })
    
    socket.on("user-joined", (remoteUserId) => {
      console.log(`User ${remoteUserId} joined the room`)
      handleUserJoined()
    })
    
    socket.on("offer", async (offer) => {
      console.log("Received offer:", offer)
      await handleOffer(offer)
    })
    
    socket.on("answer", (answer) => {
      console.log("Received answer:", answer)
      handleAnswer(answer)
    })
    
    socket.on("ice-candidate", (candidate) => {
      console.log("Received ICE candidate:", candidate)
      handleIceCandidate(candidate)
    })
    
    socket.on("user-left", () => {
      console.log("Remote user left")
      handleUserLeft()
    })
    
    socket.on("room-full", () => {
      setAlertMessage({
        title: "Room is full",
        description: "This room already has 2 participants. Please try a different room."
      })
      setShowAlert(true)
      setIsWaiting(false)
    })
    
    socket.on("room-not-found", () => {
      setAlertMessage({
        title: "Room not found",
        description: "The room ID you entered doesn't exist or is no longer active."
      })
      setShowAlert(true)
      setIsWaiting(false)
    })
    
    // Initialize media devices
    initLocalStream()
    
    // Cleanup on component unmount
    return () => {
      cleanup()
      socket.disconnect()
    }
  }, [])

  // Update video references when streams change  
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef.current]);
  
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Set remote video stream:", remoteStream.id);
    }
  }, [remoteStream, remoteVideoRef.current]);
  
  const initLocalStream = async () => {
    try {
      console.log("Initializing local media stream...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log("Local stream obtained:", stream.id);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Set local video element source");
      } else {
        console.warn("Local video ref not available");
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setConnectionError("Failed to access camera/microphone. Please ensure you have given permission.");
    }
  }
  
  const initPeerConnection = () => {
    console.log("Initializing peer connection...");
    // STUN/TURN servers for NAT traversal
    const iceServers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        // Add TURN servers for production
      ]
    };
    
    const pc = new RTCPeerConnection(iceServers);
    peerConnectionRef.current = pc;
    
    // Add local tracks to peer connection
    if (localStream) {
      console.log("Adding local tracks to peer connection");
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    } else {
      console.error("No local stream available when initializing peer connection");
    }
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Generated ICE candidate locally");
        socketRef.current?.emit("ice-candidate", {
          candidate: event.candidate,
          roomId: String(currentRoomId)
        });
      }
    };
    
    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log("Connection state changed:", pc.connectionState);
      setConnectionState(pc.connectionState);
      
      if (pc.connectionState === "connected") {
        console.log("WebRTC connection established successfully!");
        setIsCallActive(true);
        setIsWaiting(false);
        setShowCallSetup(false);
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        console.log("WebRTC connection failed or disconnected");
        endCall();
      }
    };
    
    // Debug ice connection state
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };
    
    // Handle receiving remote tracks
    pc.ontrack = (event) => {
      console.log("Received remote track!", event.streams.length);
      if (event.streams && event.streams[0]) {
        const remoteMediaStream = event.streams[0];
        console.log("Setting remote stream:", remoteMediaStream.id);
        
        setRemoteStream(remoteMediaStream);
        
        if (remoteVideoRef.current) {
          console.log("Setting remote video element source");
          remoteVideoRef.current.srcObject = remoteMediaStream;
        } else {
          console.warn("Remote video ref not available");
        }
        
        setIsCallActive(true);
        setIsWaiting(false);
        setShowCallSetup(false);
      } else {
        console.error("No remote stream available in track event");
      }
    };
    
    return pc;
  };
  
  const startCall = async () => {
    try {
      setIsWaiting(true);
      
      // Join room
      console.log("Joining room as initiator:", currentRoomId);
      socketRef.current?.emit("join-room", { 
        roomId: String(currentRoomId), 
        userId 
      });
      
      // Initialize peer connection
      const pc = initPeerConnection();
      
      // Create and send offer
      console.log("Creating offer...");
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log("Setting local description...");
      await pc.setLocalDescription(offer);
      
      console.log("Sending offer to signaling server");
      socketRef.current?.emit("offer", {
        offer,
        roomId: String(currentRoomId)
      });
      
    } catch (error) {
      console.error("Error starting call:", error);
      setConnectionError("Failed to establish call connection");
      setIsWaiting(false);
    }
  };
  
  const joinCall = async () => {
    try {
      if (!joinRoomId.trim()) {
        setAlertMessage({
          title: "Missing Room ID",
          description: "Please enter a room ID to join."
        });
        setShowAlert(true);
        return;
      }
      
      setIsWaiting(false);
      setCurrentRoomId(joinRoomId);
      
      // Join room
      console.log("Joining room as participant:", joinRoomId);
      socketRef.current?.emit("join-room", { 
        roomId: String(joinRoomId), 
        userId 
      });
      
      // Initialize peer connection (but don't create offer)
      initPeerConnection();
      
    } catch (error) {
      console.error("Error joining call:", error);
      setConnectionError("Failed to join call");
      setIsWaiting(false);
    }
  };
  
  const handleUserJoined = async () => {
    try {
      console.log("Remote user joined, checking peer connection");
      // If we're not already in a call, initialize connection
      if (!peerConnectionRef.current) {
        initPeerConnection();
      }
    } catch (error) {
      console.error("Error handling user joined:", error);
    }
  };
  
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    try {
      console.log("Processing received offer");
      // If we don't have a connection yet, create one
      if (!peerConnectionRef.current) {
        initPeerConnection();
      }
      
      const pc = peerConnectionRef.current!;
      
      // Set remote description (the offer)
      console.log("Setting remote description from offer");
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create and send answer
      console.log("Creating answer...");
      const answer = await pc.createAnswer();
      
      console.log("Setting local description from answer");
      await pc.setLocalDescription(answer);
      
      console.log("Sending answer to signaling server");
      socketRef.current?.emit("answer", {
        answer,
        roomId: String(currentRoomId)
      });
      
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };
  
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    try {
      console.log("Processing received answer");
      const pc = peerConnectionRef.current;
      if (pc) {
        console.log("Setting remote description from answer");
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } else {
        console.error("No peer connection available when handling answer");
      }
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };
  
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      console.log("Adding received ICE candidate");
      const pc = peerConnectionRef.current;
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        console.error("No peer connection available when handling ICE candidate");
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
    }
  };
  
  const handleUserLeft = () => {
    console.log("Handling remote user left event");
    setRemoteStream(null);
    setIsCallActive(false);
    setShowCallSetup(true);
    
    // Create a new peer connection for next call
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };
  
  const endCall = () => {
    console.log("Ending call");
    // Notify server
    socketRef.current?.emit("leave-room", { roomId: String(currentRoomId) });
    
    // Reset states
    setIsCallActive(false);
    setIsWaiting(false);
    setShowCallSetup(true);
    
    // Close connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Clear remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
  };
  
  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };
  
  const cleanup = () => {
    // Stop local media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Stop remote media tracks
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    
    // Close RTCPeerConnection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Leave room
    socketRef.current?.emit("leave-room", { roomId: String(currentRoomId) });
  };
  
  // Handle component unmount or closing
  const handleClose = () => {
    cleanup();
    onClose();
  };
  
  // Copy room ID to clipboard
  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoomId)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error("Failed to copy room ID:", err));
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">1-on-1 Video Call</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {connectionError && (
          <div className="mb-3 p-2 bg-red-100 text-red-800 rounded-md text-sm">
            {connectionError}
          </div>
        )}
        
        {connectionState && (
          <div className="mb-2 text-xs text-muted-foreground">
            Connection state: {connectionState}
          </div>
        )}
        
        {/* Call Setup UI */}
        {showCallSetup && !isCallActive && (
          <div className="mb-4">
            <Tabs defaultValue="create">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Call</TabsTrigger>
                <TabsTrigger value="join">Join Call</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="mt-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input 
                      value={currentRoomId} 
                      readOnly 
                      className="flex-1"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyRoomId}
                    >
                      {copySuccess ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Share this Room ID with someone to join your call.
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={startCall} 
                    disabled={isWaiting}
                  >
                    {isWaiting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                        Waiting for participant...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" /> 
                        Start Call
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="join" className="mt-2">
                <div className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Enter Room ID to join" 
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={joinCall} 
                    disabled={isWaiting}
                  >
                    {isWaiting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                        Joining call...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" /> 
                        Join Call
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Video display */}
        <div className="grid grid-cols-1 gap-2 mb-3">
          {isCallActive ? (
            <div className="relative">
              {/* Main remote video */}
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <video 
                  ref={remoteVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* PiP local video */}
              <div className="absolute bottom-2 right-2 w-1/4 aspect-video bg-muted rounded-lg overflow-hidden border-2 border-background shadow-md">
                <video 
                  ref={localVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {isWaiting ? (
                <div className="flex items-center justify-center h-full flex-col gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <div className="text-sm text-muted-foreground">
                    {joinRoomId ? "Joining call..." : "Waiting for someone to join..."}
                  </div>
                </div>
              ) : (
                <video 
                  ref={localVideoRef}
                  autoPlay={true}
                  playsInline={true}
                  muted={true}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </div>
        
        {/* Call controls */}
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleMute}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4 mr-1" />
            ) : (
              <Mic className="h-4 w-4 mr-1" />
            )}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleCamera}
          >
            {isCameraOff ? (
              <VideoOff className="h-4 w-4 mr-1" />
            ) : (
              <Video className="h-4 w-4 mr-1" />
            )}
            {isCameraOff ? "Start Video" : "Stop Video"}
          </Button>
          
          {isCallActive || isWaiting ? (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={endCall}
            >
              <PhoneOff className="h-4 w-4 mr-1" />
              End Call
            </Button>
          ) : !showCallSetup ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => setShowCallSetup(true)}
            >
              <Phone className="h-4 w-4 mr-1" />
              New Call
            </Button>
          ) : null}
        </div>
      </CardContent>
      
      {/* Alerts */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertMessage.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default VideoCall