// File: /components/TalkToPDF.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send, CloudOff, BrainCircuit } from "lucide-react";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface TalkToPDFProps {
    documentText?: string;
    documentTitle?: string;
    documentId?: string;
}

export default function TalkToPDF({ documentText, documentTitle, documentId }: TalkToPDFProps) {
    const [query, setQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isModelReady, setIsModelReady] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

    useEffect(() => {
        const handleSpacebar = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            // Check if typing in input or textarea or contenteditable
            const isTyping =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.getAttribute("contenteditable") === "true";

            if (!isTyping && e.code === "Space") {
                e.preventDefault();
                // Your mic toggle function here
                console.log("Mic toggled");
            }
        };

        window.addEventListener("keydown", handleSpacebar);

        return () => {
            window.removeEventListener("keydown", handleSpacebar);
        };
    }, []);

    useEffect(() => {
        if (!documentText && !documentId) return;

        // Initialize document context when document changes
        const initializeContext = async () => {
            setIsLoading(true);
            setIsModelReady(false);
            setError(null);
            setMessages([]);
            setConversationHistory([]);

            try {
                // If we have document text but no ID, we need to process it first
                if (documentText && !documentId) {
                    await fetch('/api/gemini/process', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            documentText,
                            documentTitle: documentTitle || "Untitled Document"
                        })
                    });
                }

                // Add system welcome message
                const welcomeMessage: Message = {
                    role: "system",
                    content: `I'm ready to answer questions about "${documentTitle || 'this document'}". What would you like to know?`
                };

                setMessages([welcomeMessage]);
                setIsModelReady(true);
            } catch (err) {
                setError("Failed to prepare document for questions. Please try again.");
                console.error("Error initializing document context:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initializeContext();
    }, [documentText, documentTitle, documentId]);

    // Auto-scroll to bottom when new messages appear
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !isModelReady) return;

        const userQuery = query.trim();
        setQuery("");

        // Add user message to chat
        const userMessage: Message = {
            role: "user",
            content: userQuery
        };

        setMessages(prev => [...prev, userMessage]);

        // Update conversation history
        const updatedHistory = [...conversationHistory, userMessage];
        setConversationHistory(updatedHistory);

        setIsLoading(true);

        try {
            // Call the Gemini API
            const response = await fetch('/api/gemini/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userQuery,
                    documentId,
                    documentText: !documentId ? documentText : undefined,
                    documentTitle,
                    conversationHistory: updatedHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get a response");
            }

            const data = await response.json();

            // Add AI response to chat
            const assistantMessage: Message = {
                role: "assistant",
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
            setConversationHistory([...updatedHistory, assistantMessage]);

        } catch (err) {
            setError("Failed to get an answer. Please try again.");
            console.error("Error querying document:", err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    <span className="font-medium">Talk to PDF with Gemini</span>
                </div>
                {documentTitle && (
                    <div className="text-xs text-muted-foreground">
                        {documentTitle}
                    </div>
                )}
            </div>

            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: "400px" }}
            >
                {!documentText && !documentId && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <CloudOff className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No document loaded. Please open a document to start asking questions.
                        </p>
                    </div>
                )}

                {(documentText || documentId) && !isModelReady && isLoading && (
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
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user'
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