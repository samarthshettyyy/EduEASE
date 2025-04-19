import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, MessageSquare, Send, CloudOff, BrainCircuit } from "lucide-react";

export default function TalkToPDF({ documentText, documentTitle }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const chatContainerRef = useRef(null);

  // Context setup - maintain document context for better answers
  const [documentContext, setDocumentContext] = useState(null);

  useEffect(() => {
    if (!documentText) return;
    
    // Initialize document context when document changes
    const initializeContext = async () => {
      setIsLoading(true);
      setIsModelReady(false);
      setError(null);
      
      try {
        // In a real implementation, this would process the document with Gemini
        // Here we're simulating the model loading/preparation time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setDocumentContext({
          title: documentTitle,
          content: documentText,
          wordCount: documentText.split(/\s+/).length,
        });
        
        // Add system welcome message
        setMessages([{
          role: "system",
          content: `I'm ready to answer questions about "${documentTitle}". What would you like to know?`
        }]);
        
        setIsModelReady(true);
      } catch (err) {
        setError("Failed to prepare document for questions. Please try again.");
        console.error("Error initializing document context:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeContext();
  }, [documentText, documentTitle]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !isModelReady) return;

    const userQuery = query.trim();
    setQuery("");
    
    // Add user message to chat
    setMessages(prev => [...prev, {
      role: "user",
      content: userQuery
    }]);

    setIsLoading(true);
    
    try {
      // In a real implementation, this would call Gemini API
      // Here we're simulating the API call with relevant document context
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be the actual API call:
      // const response = await fetch('/api/gemini/query', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     query: userQuery,
      //     documentContext: documentContext
      //   })
      // });
      // const data = await response.json();
      
      // Simulate response based on query content
      let simulatedResponse;
      
      if (userQuery.toLowerCase().includes("cell")) {
        simulatedResponse = "Based on the document, cells are the basic unit of life. They contain various organelles including a nucleus which houses genetic material and controls cell activities.";
      } else if (userQuery.toLowerCase().includes("structure") || userQuery.toLowerCase().includes("organelle")) {
        simulatedResponse = "The document discusses cell structures including the nucleus (central control), cell membrane (outer boundary), cytoplasm (gel-like substance), and various organelles that perform specific functions.";
      } else if (userQuery.toLowerCase().includes("chapter") || userQuery.toLowerCase().includes("what is this about")) {
        simulatedResponse = "This document covers Chapter 3: Cell Structure, which discusses the fundamental components of cells, their organization, and functions.";
      } else {
        simulatedResponse = "Based on the document content, I can answer that question but would need more specific details about what aspect of cell structure you're interested in.";
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: simulatedResponse
      }]);
      
    } catch (err) {
      setError("Failed to get an answer. Please try again.");
      console.error("Error querying document:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <span className="font-medium">Talk to PDF</span>
        </div>
        {documentContext && (
          <div className="text-xs text-muted-foreground">
            {documentContext.title}
          </div>
        )}
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: "400px" }}
      >
        {!documentText && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <CloudOff className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No document loaded. Please open a document to start asking questions.
            </p>
          </div>
        )}
        
        {documentText && !isModelReady && isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Preparing document for Q&A...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : msg.role === 'system'
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isModelReady ? "Ask a question about this document..." : "Loading document..."}
            className="flex-1 min-h-10 max-h-32"
            disabled={!isModelReady || isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!isModelReady || isLoading || !query.trim()}
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
}