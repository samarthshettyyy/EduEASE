// components/DocumentViewer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX, Plus, X, FileText, BookOpen, FileType } from "lucide-react";

interface DocumentViewerProps {
  sessionId: string;
  filename: string;
  text: string;
  sentences: string[];
  initialImportantWords: string[];
  extractionStats?: {
    extraction_method: string;
    character_count: number;
    word_count: number;
    is_empty: boolean;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  sessionId,
  filename,
  text,
  sentences,
  initialImportantWords,
  extractionStats
}) => {
  // TTS state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number[]>([1.0]);
  const [pitch, setPitch] = useState<number[]>([1.0]);
  const [volume, setVolume] = useState<number[]>([1.0]);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [importantWords, setImportantWords] = useState<string[]>(initialImportantWords || []);
  const [newWordInput, setNewWordInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("reader");
  
  // Refs for speech synthesis
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);
        
        if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };
      
      // Some browsers load voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
    }
    
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  // Check if a word is marked as important
  const isImportantWord = (word: string): boolean => {
    const cleanWord = word.replace(/[.,!?;:'"()\[\]{}]/g, '').toLowerCase();
    return importantWords.some(important => cleanWord === important.toLowerCase());
  };

  // Speak the current sentence
  const speakCurrentSentence = () => {
    if (!synth.current || !sentences[currentSentenceIndex]) return;
    
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    
    const currentText = sentences[currentSentenceIndex];
    utterance.current = new SpeechSynthesisUtterance(currentText);
    
    // Set voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.current.voice = voice;
    }
    
    // Set speech parameters
    utterance.current.rate = rate[0];
    utterance.current.pitch = pitch[0];
    utterance.current.volume = volume[0];
    
    // Word boundary event for highlighting
    utterance.current.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate which word we're on based on character index
        const words = currentText.split(' ');
        
        let charCount = 0;
        let wordIndex = 0;
        
        for (let i = 0; i < words.length; i++) {
          charCount += words[i].length;
          
          if (event.charIndex <= charCount) {
            wordIndex = i;
            break;
          }
          
          // Add 1 for the space after each word
          charCount += 1;
        }
        
        setCurrentWordIndex(wordIndex);
      }
    };
    
    // When speech ends
    utterance.current.onend = () => {
      // Automatically move to next sentence if available
      if (currentSentenceIndex < sentences.length - 1 && isReading) {
        setCurrentSentenceIndex(prevIndex => prevIndex + 1);
      } else {
        setIsReading(false);
        setCurrentWordIndex(-1);
      }
    };
    
    // Speak the utterance
    synth.current.speak(utterance.current);
  };

  // Toggle play/pause
  const togglePlayback = () => {
    if (isReading) {
      if (synth.current) {
        synth.current.cancel();
      }
      setIsReading(false);
    } else {
      setIsReading(true);
    }
  };

  // Effects for changes in reading state
  useEffect(() => {
    if (isReading) {
      speakCurrentSentence();
    }
  }, [isReading, currentSentenceIndex]);

  // Go to previous sentence
  const prevSentence = () => {
    if (currentSentenceIndex > 0) {
      if (synth.current) {
        synth.current.cancel();
      }
      setIsReading(false);
      setCurrentSentenceIndex(prevIndex => prevIndex - 1);
      setCurrentWordIndex(-1);
    }
  };

  // Go to next sentence
  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      if (synth.current) {
        synth.current.cancel();
      }
      setIsReading(false);
      setCurrentSentenceIndex(prevIndex => prevIndex + 1);
      setCurrentWordIndex(-1);
    }
  };

  // Add a new important word
  const addImportantWord = () => {
    const word = newWordInput.trim();
    
    if (word && !importantWords.includes(word.toLowerCase())) {
      setImportantWords(current => [...current, word.toLowerCase()]);
      setNewWordInput("");
    }
  };

  // Remove an important word
  const removeImportantWord = (word: string) => {
    setImportantWords(current => current.filter(w => w !== word));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {filename.endsWith('.pdf') && <FileText className="h-5 w-5 text-red-500" />}
          {filename.endsWith('.docx') && <FileText className="h-5 w-5 text-blue-500" />}
          {filename.endsWith('.txt') && <FileText className="h-5 w-5 text-gray-500" />}
          {!filename.endsWith('.pdf') && !filename.endsWith('.docx') && !filename.endsWith('.txt') && 
            <FileType className="h-5 w-5 text-gray-500" />}
          <h2 className="text-xl font-semibold">{filename}</h2>
        </div>

        {extractionStats && (
          <div className="text-sm text-muted-foreground">
            {extractionStats.word_count} words | {extractionStats.character_count} characters | Method: {extractionStats.extraction_method}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reader">Reader</TabsTrigger>
          <TabsTrigger value="document">Document</TabsTrigger>
        </TabsList>

        <TabsContent value="reader" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Text-to-Speech Reader</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={togglePlayback}>
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
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Reading Speed</label>
                  <div className="flex items-center gap-4">
                    <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    <Slider value={rate} onValueChange={setRate} min={0.5} max={2} step={0.1} />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current: {rate[0]}x</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Pitch</label>
                  <Slider value={pitch} onValueChange={setPitch} min={0.5} max={1.5} step={0.1} />
                  <p className="text-xs text-muted-foreground mt-1">Current: {pitch[0]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Volume</label>
                  <div className="flex items-center gap-4">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider value={volume} onValueChange={setVolume} min={0} max={1} step={0.1} />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Current: {volume[0]}</p>
                </div>
              </div>
              
              {/* Text Navigation Controls */}
              <div className="flex justify-center items-center space-x-4 my-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={prevSentence} 
                  disabled={currentSentenceIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Sentence {currentSentenceIndex + 1} of {sentences.length}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={nextSentence} 
                  disabled={currentSentenceIndex >= sentences.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {/* Text display with highlighting */}
              <div className="rounded-lg p-4 bg-muted mt-2 max-h-[300px] overflow-y-auto">
                {sentences.map((sentence, sentIndex) => {
                  // Split sentence into words for individual highlighting
                  const words = sentence.split(' ');
                  
                  return (
                    <div 
                      key={sentIndex}
                      className={`mb-2 ${sentIndex === currentSentenceIndex ? 'opacity-100' : 'opacity-60'}`}
                    >
                      {words.map((word, wordIndex) => {
                        const isImportant = isImportantWord(word);
                        const isCurrent = sentIndex === currentSentenceIndex && wordIndex === currentWordIndex;
                        
                        return (
                          <span 
                            key={`${sentIndex}-${wordIndex}`}
                            className={`
                              ${isImportant ? 'font-bold text-purple-700 underline' : ''}
                              ${isCurrent ? 'bg-yellow-100 px-1 rounded' : ''}
                            `}
                          >
                            {word}{wordIndex < words.length - 1 ? ' ' : ''}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Important Words Component */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <CardTitle className="text-lg">Important Words</CardTitle>
              </div>
              <CardDescription>Words that will be highlighted during reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <Input
                  value={newWordInput}
                  onChange={(e) => setNewWordInput(e.target.value)}
                  placeholder="Add word to highlight"
                  onKeyPress={(e) => e.key === 'Enter' && addImportantWord()}
                  className="flex-grow"
                />
                <Button onClick={addImportantWord} className="ml-2">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {importantWords.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No important words added yet</p>
                ) : (
                  importantWords.map((word) => (
                    <div 
                      key={word} 
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                    >
                      {word}
                      <button 
                        onClick={() => removeImportantWord(word)} 
                        className="ml-1 text-purple-600 hover:text-purple-900"
                        aria-label={`Remove ${word}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Document Content</CardTitle>
              <CardDescription>Full text from {filename}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg p-4 bg-muted max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                {text}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;