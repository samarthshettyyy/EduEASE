"use client";

import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";
import SimpleModelViewer from "@/components/SimpleModelViewer";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Upload,
  Save,
  Eye,
  Plus,
  Trash2,
  Edit,
  Volume2,
  Globe,
  ImageIcon,
  CuboidIcon as Cube,
  Play,
  ArrowLeft,
  Users,
  BarChart,
  AlertCircle,
} from "lucide-react";

export default function TeacherClassroomPage() {
  const params = useParams();
  const classroomId = params.id;
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedChapter, setSelectedChapter] = useState("chapter-3");
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [images, setImages] = useState([
    {
      id: "img1",
      url: "/placeholder.svg?height=200&width=300",
      caption: "Cell structure diagram",
    },
    {
      id: "img2",
      url: "/placeholder.svg?height=200&width=300",
      caption: "Cell membrane structure",
    },
  ]);
  // Content management states
  const [contentTitle, setContentTitle] = useState("Cell Structure");
  const [contentText, setContentText] = useState(
    'Cells are the basic structural and functional units of all living organisms. They are often called the "building blocks of life." The study of cells is called cell biology.\n\nEach cell contains specialized structures called organelles that perform specific functions. The two main types of cells are prokaryotic and eukaryotic cells.'
  );
  const [importantWords, setImportantWords] = useState([
    "cell biology",
    "organelles",
    "prokaryotic",
    "eukaryotic",
  ]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  // Accessibility settings
  const [enableTTS, setEnableTTS] = useState(true);
  const [enableEmotionDetection, setEnableEmotionDetection] = useState(true);
  const [enableAdaptiveContent, setEnableAdaptiveContent] = useState(true);
  const [enableSignLanguage, setEnableSignLanguage] = useState(true);
  const [enableVoiceNavigation, setEnableVoiceNavigation] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>>([]);

  // Adaptive content states
  const [standardContent, setStandardContent] = useState(contentText);
  const [simplifiedContent, setSimplifiedContent] = useState(
    "Cells are tiny building blocks that make up all living things. They are very important parts of plants, animals, and humans.\n\nInside cells are special parts called organelles. Each part has a job to do. There are two main types of cells: simple cells (prokaryotic) and complex cells (eukaryotic)."
  );
  const [detailedContent, setDetailedContent] = useState(
    "Cells are the fundamental structural and functional units of all living organisms. They are microscopic compartments that hold the biological equipment necessary for survival.\n\nEach cell contains specialized structures called organelles that perform specific functions, similar to organs in the human body. The two main types of cells are prokaryotic (lacking a nucleus and membrane-bound organelles) and eukaryotic (containing a nucleus and membrane-bound organelles). Your body is composed entirely of eukaryotic cells, which are more complex and evolved later than prokaryotic cells."
  );
  const [models3D, setModels3D] = useState<
    Array<{
      id: string | number;
      title: string;
      description: string;
      modelPath: string;
      thumbnailPath?: string;
      format: string;
    }>
  >([]);

  const [isUploading3D, setIsUploading3D] = useState<boolean>(false);

  // Quiz management
  const importContent = async (): Promise<void> => {
    if (!selectedChapter) {
      alert("Please select a chapter first.");
      return;
    }

    // For PDF import, open a file dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      setIsImporting(true); // Show loading indicator

      const formData = new FormData();
      formData.append("file", file);
      formData.append("chapterId", selectedChapter);

      try {
        const res = await fetch("/api/classroom/pdf-import", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to import PDF content.");
          setIsImporting(false);
          return;
        }

        // Fetch the latest content from the database
        const contentResponse = await fetch(
          `/api/classroom/content?chapterId=${selectedChapter}`
        );
        const chapterData = await contentResponse.json();

        if (contentResponse.ok && chapterData) {
          // Set the extracted text into all relevant content fields
          setContentTitle(chapterData.title || data.title || contentTitle);

          // Update all content versions with the imported content
          setContentText(
            chapterData.standardContent || data.content || contentText
          );
          setStandardContent(
            chapterData.standardContent || data.content || standardContent
          );
          setSimplifiedContent(
            chapterData.simplifiedContent || simplifiedContent
          );
          setDetailedContent(chapterData.detailedContent || detailedContent);

          // Update important words
          if (chapterData.importantWords) {
            try {
              const wordsArray =
                typeof chapterData.importantWords === "string"
                  ? JSON.parse(chapterData.importantWords)
                  : chapterData.importantWords;

              if (Array.isArray(wordsArray) && wordsArray.length > 0) {
                setImportantWords(wordsArray);
              }
            } catch (e) {
              console.error("Error parsing important words:", e);
            }
          }

          // Update quiz questions if available
          if (chapterData.quizQuestions) {
            try {
              const questionsArray =
                typeof chapterData.quizQuestions === "string"
                  ? JSON.parse(chapterData.quizQuestions)
                  : chapterData.quizQuestions;

              if (Array.isArray(questionsArray) && questionsArray.length > 0) {
                setQuizQuestions(questionsArray);
              }
            } catch (e) {
              console.error("Error parsing quiz questions:", e);
            }
          }

          // Update settings if available
          if (chapterData.settings) {
            try {
              const settingsObj =
                typeof chapterData.settings === "string"
                  ? JSON.parse(chapterData.settings)
                  : chapterData.settings;

              if (settingsObj) {
                if (settingsObj.enableTTS !== undefined)
                  setEnableTTS(!!settingsObj.enableTTS);
                if (settingsObj.enableEmotionDetection !== undefined)
                  setEnableEmotionDetection(
                    !!settingsObj.enableEmotionDetection
                  );
                if (settingsObj.enableAdaptiveContent !== undefined)
                  setEnableAdaptiveContent(!!settingsObj.enableAdaptiveContent);
                if (settingsObj.enableSignLanguage !== undefined)
                  setEnableSignLanguage(!!settingsObj.enableSignLanguage);
                if (settingsObj.enableVoiceNavigation !== undefined)
                  setEnableVoiceNavigation(!!settingsObj.enableVoiceNavigation);
              }
            } catch (e) {
              console.error("Error parsing settings:", e);
            }
          }
        } else {
          // Fallback to just using the data from the PDF import response
          setContentTitle(data.title || contentTitle);
          setContentText(data.content || contentText);
          setStandardContent(data.content || standardContent);
        }

        setIsImporting(false); // Hide loading indicator
        alert("PDF content imported successfully!");
      } catch (err) {
        console.error("PDF import error:", err);
        alert(
          "Error importing PDF content: " +
            (err instanceof Error ? err.message : String(err))
        );
        setIsImporting(false);
      }
    };

    input.click();
  };

  const simplifyContent = (content: string): string => {
    // This is a placeholder - in a real app, you might use AI to simplify text
    if (!content) return "";

    // Crude simplification for demonstration
    return content
      .split(". ")
      .slice(0, 10) // Take first 10 sentences
      .join(". ")
      .replace(/([A-Za-z]{10,})/g, (match) => {
        // Replace long words with simpler ones when possible
        const simpleWords: Record<string, string> = {
          fundamental: "basic",
          structural: "basic",
          functional: "working",
          organisms: "living things",
          microscopic: "tiny",
          equipment: "parts",
          specialized: "special",
          prokaryotic: "simple",
          eukaryotic: "complex",
        };

        return simpleWords[match.toLowerCase()] || match;
      });
  };

  const enhanceContent = (content: string): string => {
    // This is a placeholder - in a real app, you might use AI to enhance text
    if (!content) return "";

    // Just a crude enhancement for demonstration
    return (
      content +
      "\n\nAdditional Information: Cells were first discovered by Robert Hooke in 1665 when he examined a slice of cork under a microscope. The cell theory, which states that all living organisms are composed of cells, was formulated in the 19th century by Matthias Schleiden and Theodor Schwann. Modern cell biology has revealed incredible complexity within cells, including thousands of biochemical reactions that occur simultaneously."
    );
  };

  const extractImportantWords = (content: string): string[] => {
    // This is a placeholder - in a real app, you might use NLP for keyword extraction
    if (!content) return [];

    // Define common science terms to look for
    const scienceTerms: string[] = [
      "cell",
      "biology",
      "organelle",
      "nucleus",
      "membrane",
      "mitochondria",
      "prokaryotic",
      "eukaryotic",
      "cytoplasm",
      "ribosome",
      "chromosome",
      "dna",
      "rna",
      "protein",
      "enzyme",
      "metabolism",
      "photosynthesis",
      "respiration",
      "golgi",
    ];

    // Look for these terms in the content
    const foundTerms = scienceTerms.filter((term) =>
      new RegExp(`\\b${term}\\b`, "i").test(content)
    );

    // Return up to 6 found terms, or the original important words if none found
    return foundTerms.length > 0 ? foundTerms.slice(0, 6) : importantWords;
  };

  // Handle file upload
  // Updated handleFileUpload function for page.tsx
  const handleFileUpload = (type: string) => {
    const input = document.createElement("input");
    input.type = "file";

    if (type === "image") {
      input.accept = "image/*";
    } else if (type === "video") {
      input.accept = "video/*";
    } else if (type === "3d") {
      input.accept = ".glb,.gltf";
    } else if (type === "audio") {
      input.accept = "audio/*";
    }

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      // Create a preview immediately for better UX
      if (type === "image") {
        // Create an object URL for instant preview
        const previewUrl = URL.createObjectURL(file);
        const tempId = `temp-${Date.now()}`;

        // Add a temporary image to the state with a loading indicator
        setImages((prev) => [
          ...prev,
          {
            id: tempId,
            url: previewUrl,
            caption: "Uploading...",
          },
        ]);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("chapterId", selectedChapter);
      formData.append("type", type);

      try {
        const res = await fetch("/api/classroom/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          // Remove the temporary image if upload failed
          if (type === "image") {
            setImages((prev) =>
              prev.filter((img) => !img.id.startsWith("temp-"))
            );
          }
          alert(data.error || "File upload failed.");
          return;
        }

        // Update UI based on file type
        if (type === "image") {
          // Replace the temporary image with the actual uploaded one or add it if no temp image
          setImages((prev) => {
            const filteredImages = prev.filter(
              (img) => !img.id.startsWith("temp-")
            );
            return [
              ...filteredImages,
              {
                id: data.id,
                url: data.url,
                caption: file.name.split(".")[0] || "New image", // Use filename as initial caption
              },
            ];
          });
        } else if (type === "video" || type === "3d" || type === "audio") {
          alert(`${type.toUpperCase()} file uploaded successfully!`);
          // You'd update corresponding state here depending on your UI
        }
      } catch (err) {
        // Remove the temporary image on error
        if (type === "image") {
          setImages((prev) =>
            prev.filter((img) => !img.id.startsWith("temp-"))
          );
        }
        console.error("File upload error:", err);
        alert("Error uploading file.");
      }
    };

    input.click();
  };

  const fetchChapterContent = async (chapterId: string) => {
    try {
      const response = await fetch(
        `/api/classroom/content?chapterId=${chapterId}`
      );

      if (!response.ok) {
        console.error("Failed to fetch chapter content");
        return;
      }

      const data = await response.json();

      // Update content title
      if (data.title) {
        setContentTitle(data.title);
      }

      // Update content fields
      if (data.standardContent) {
        setStandardContent(data.standardContent);
        setContentText(data.standardContent);
      }

      if (data.simplifiedContent) {
        setSimplifiedContent(data.simplifiedContent);
      }

      if (data.detailedContent) {
        setDetailedContent(data.detailedContent);
      }

      // Update important words
      if (data.importantWords) {
        try {
          const wordsArray =
            typeof data.importantWords === "string"
              ? JSON.parse(data.importantWords)
              : data.importantWords;

          if (Array.isArray(wordsArray) && wordsArray.length > 0) {
            setImportantWords(wordsArray);
          }
        } catch (e) {
          console.error("Error parsing important words:", e);
        }
      }

      // Update quiz questions
      if (data.quizQuestions) {
        try {
          const questionsArray =
            typeof data.quizQuestions === "string"
              ? JSON.parse(data.quizQuestions)
              : data.quizQuestions;

          if (Array.isArray(questionsArray) && questionsArray.length > 0) {
            setQuizQuestions(questionsArray);
          }
        } catch (e) {
          console.error("Error parsing quiz questions:", e);
        }
      }

      // Update images
      if (data.images) {
        try {
          const imagesArray =
            typeof data.images === "string"
              ? JSON.parse(data.images)
              : data.images;

          if (Array.isArray(imagesArray) && imagesArray.length > 0) {
            setImages(imagesArray);
          }
        } catch (e) {
          console.error("Error parsing images:", e);
        }
      }

      // Also fetch media files from the mediaFiles table
      if (data.mediaFiles && Array.isArray(data.mediaFiles)) {
        const imageFiles = data.mediaFiles.filter(
          (file) => file.type === "image"
        );

        if (imageFiles.length > 0) {
          // Create image objects from the media files
          const mediaImages = imageFiles.map((file) => ({
            id: file.id.toString(),
            url: file.url,
            caption: file.filename.split(".")[0] || "Image",
          }));

          // Combine with any images from the chapter content
          setImages((prevImages) => {
            // Filter out any existing images with the same IDs
            const existingIds = mediaImages.map((img) => img.id);
            const filteredPrevImages = prevImages.filter(
              (img) => !existingIds.includes(img.id)
            );

            return [...filteredPrevImages, ...mediaImages];
          });
        }
      }
    } catch (error) {
      console.error("Error fetching chapter content:", error);
    }
  };
  // Add new important word
  const addImportantWord = (word: string) => {
    if (word && !importantWords.includes(word)) {
      setImportantWords([...importantWords, word]);
    }
  };

  // Remove important word
  const removeImportantWord = (word: string) => {
    setImportantWords(importantWords.filter((w) => w !== word));
  };

  // Add new quiz question
  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      {
        question: "New question",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0,
      },
    ]);
  };

  // Remove quiz question function
  const removeQuizQuestion = (index: number) => {
    const newQuestions = [...quizQuestions];
    newQuestions.splice(index, 1);
    setQuizQuestions(newQuestions);
  };

  // Save content function that includes quiz questions
  const saveContent = async () => {
    const payload = {
      chapterId: selectedChapter,
      title: contentTitle,
      standardContent,
      simplifiedContent,
      detailedContent,
      importantWords,
      quizQuestions,
      images,
      settings: {
        enableTTS,
        enableEmotionDetection,
        enableAdaptiveContent,
        enableSignLanguage,
        enableVoiceNavigation,
      },
    };
  
    try {
      const res = await fetch("/api/classroom/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Content saved successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };
  // Fetch chapter content function, with section handling quiz questions

  const handle3DModelUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".glb,.gltf,.usdz,.obj,.fbx";

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      setIsUploading3D(true);

      // Add a temporary model entry with loading state
      const tempId = `temp-${Date.now()}`;
      setModels3D((prev) => [
        ...prev,
        {
          id: tempId,
          title: file.name.split(".")[0] || "New 3D Model",
          description: "Uploading...",
          modelPath: "",
          format: file.name.split(".").pop()?.toLowerCase() || "glb",
        },
      ]);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("chapterId", selectedChapter);
      formData.append("title", file.name.split(".")[0] || "New 3D Model");

      try {
        const res = await fetch("/api/classroom/3d-upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          // Remove the temporary model entry if upload failed
          setModels3D((prev) => prev.filter((model) => model.id !== tempId));
          alert(data.error || "Failed to upload 3D model.");
          setIsUploading3D(false);
          return;
        }

        // Replace the temporary model with the actual uploaded one
        setModels3D((prev) => {
          const filtered = prev.filter((model) => model.id !== tempId);
          return [
            ...filtered,
            {
              id: data.id,
              title: file.name.split(".")[0] || "New 3D Model",
              description: "",
              modelPath: data.url,
              thumbnailPath: data.thumbnailUrl || undefined,
              format: file.name.split(".").pop()?.toLowerCase() || "glb",
            },
          ];
        });

        setIsUploading3D(false);
        alert("3D model uploaded successfully!");
      } catch (err) {
        // Remove the temporary model on error
        setModels3D((prev) => prev.filter((model) => model.id !== tempId));
        console.error("3D model upload error:", err);
        alert("Error uploading 3D model.");
        setIsUploading3D(false);
      }
    };

    input.click();
  };

  // Function to update a 3D model
  const update3DModel = async (
    modelId: string | number,
    updateData: { title?: string; description?: string }
  ) => {
    // First update local state for immediate UI feedback
    setModels3D((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, ...updateData } : model
      )
    );

    // Then send update to server
    try {
      const res = await fetch(`/api/classroom/3d-models?modelId=${modelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update 3D model");
      }
    } catch (err) {
      console.error("Error updating 3D model:", err);
      alert("Failed to update 3D model. Please try again.");
    }
  };

  // Function to delete a 3D model
  const delete3DModel = async (modelId: string | number) => {
    if (!confirm("Are you sure you want to delete this 3D model?")) {
      return;
    }

    // First update local state for immediate UI feedback
    setModels3D((prev) => prev.filter((model) => model.id !== modelId));

    // Then send delete request to server
    try {
      const res = await fetch(`/api/classroom/3d-models?modelId=${modelId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete 3D model");
      }
    } catch (err) {
      console.error("Error deleting 3D model:", err);
      alert("Failed to delete 3D model. Please try again.");

      // Fetch the latest models to restore state
      fetch3DModels(selectedChapter);
    }
  };

  // Function to fetch 3D models for a chapter
  const fetch3DModels = async (chapterId: string) => {
    try {
      const res = await fetch(
        `/api/classroom/3d-models?chapterId=${chapterId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch 3D models");
      }

      const data = await res.json();
      setModels3D(data);
    } catch (err) {
      console.error("Error fetching 3D models:", err);
    }
  };

  // Add this to your useEffect to fetch 3D models when the chapter changes
  useEffect(() => {
    if (selectedChapter && selectedChapter !== "add-new") {
      fetch3DModels(selectedChapter);
    }
  }, [selectedChapter]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/teacher/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-muted" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="text-lg font-medium">Biology 101</span>
              <span className="text-sm text-muted-foreground">
                (Teacher View)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="gap-1"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? "Exit Preview" : "Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setShowPublishDialog(true)}
            >
              <Save className="h-4 w-4" />
              Publish
            </Button>
            <Select defaultValue="english">
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
            <Link href="/teacher/classroom/biology-101/students">
              <Button variant="ghost" size="icon">
                <Users className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/teacher/classroom/biology-101/analytics">
              <Button variant="ghost" size="icon">
                <BarChart className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content Area - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedChapter}
                  onValueChange={setSelectedChapter}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter-1">
                      Chapter 1: Introduction
                    </SelectItem>
                    <SelectItem value="chapter-2">
                      Chapter 2: Cell Theory
                    </SelectItem>
                    <SelectItem value="chapter-3">
                      Chapter 3: Cell Structure
                    </SelectItem>
                    <SelectItem value="chapter-4">
                      Chapter 4: Cell Function
                    </SelectItem>
                    <SelectItem value="add-new">+ Add New Chapter</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-[300px]"
                  placeholder="Chapter Title"
                />
              </div>
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
                      <CardTitle>Text Content</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={importContent}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Import
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveContent}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Draft
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Add and edit the main content for this chapter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="standard-content">
                          Standard Content
                        </Label>
                        <Textarea
                          id="standard-content"
                          value={standardContent}
                          onChange={(e) => setStandardContent(e.target.value)}
                          placeholder="Enter the standard content here..."
                          className="min-h-[150px] mt-2"
                        />
                      </div>

                      {enableAdaptiveContent && (
                        <>
                          <div>
                            <Label htmlFor="simplified-content">
                              Simplified Content (for overwhelmed students)
                            </Label>
                            <Textarea
                              id="simplified-content"
                              value={simplifiedContent}
                              onChange={(e) =>
                                setSimplifiedContent(e.target.value)
                              }
                              placeholder="Enter simplified version here..."
                              className="min-h-[150px] mt-2"
                            />
                          </div>

                          <div>
                            <Label htmlFor="detailed-content">
                              Detailed Content (for confused students)
                            </Label>
                            <Textarea
                              id="detailed-content"
                              value={detailedContent}
                              onChange={(e) =>
                                setDetailedContent(e.target.value)
                              }
                              placeholder="Enter more detailed version here..."
                              className="min-h-[150px] mt-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Important Words</CardTitle>
                    <CardDescription>
                      Words that will be highlighted and emphasized during
                      text-to-speech
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {importantWords.map((word, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1"
                        >
                          <span className="text-sm">{word}</span>
                          <button
                            onClick={() => removeImportantWord(word)}
                            className="text-primary/70 hover:text-primary"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add important word"
                        id="new-important-word"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addImportantWord(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById(
                            "new-important-word"
                          ) as HTMLInputElement;
                          addImportantWord(input.value);
                          input.value = "";
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                // Updated Images and Media section for page.tsx // Replace the
                existing Images and Media card with this version
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Images and Media</CardTitle>
                    <CardDescription>
                      Add images to support the text content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          className="border rounded-lg p-4 flex flex-col items-center justify-center"
                        >
                          <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative">
                            {image.id.startsWith("temp-") ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                                <p className="text-sm">Uploading...</p>
                              </div>
                            ) : null}
                            <img
                              src={image.url}
                              alt={image.caption}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex gap-2 w-full">
                            <Input
                              placeholder="Image caption"
                              value={image.caption}
                              onChange={(e) => {
                                const updatedImages = [...images];
                                updatedImages[index].caption = e.target.value;
                                setImages(updatedImages);
                              }}
                              className="flex-1"
                              disabled={image.id.startsWith("temp-")}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setImages(images.filter((_, i) => i !== index));
                              }}
                              disabled={image.id.startsWith("temp-")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div
                        className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                        onClick={() => handleFileUpload("image")}
                      >
                        <div className="w-full aspect-video bg-muted/50 rounded-md flex flex-col items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Upload Image
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="interactive" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Elements</CardTitle>
                    <CardDescription>
                      Create interactive learning activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="interactive-1">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <span>Interactive Cell Explorer</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="aspect-video bg-muted rounded-lg relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                  src="/placeholder.svg?height=400&width=600"
                                  alt="Interactive cell diagram"
                                  className="max-w-full max-h-full"
                                />
                                {/* Interactive hotspots */}
                                <div className="absolute top-1/4 left-1/2 h-4 w-4 bg-primary rounded-full" />
                                <div className="absolute top-1/2 left-1/3 h-4 w-4 bg-primary rounded-full" />
                                <div className="absolute bottom-1/3 right-1/4 h-4 w-4 bg-primary rounded-full" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Hotspot 1</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    placeholder="Title"
                                    defaultValue="Nucleus"
                                  />
                                  <Input
                                    placeholder="X position"
                                    defaultValue="50%"
                                    className="w-20"
                                  />
                                  <Input
                                    placeholder="Y position"
                                    defaultValue="25%"
                                    className="w-20"
                                  />
                                </div>
                                <Textarea
                                  placeholder="Description"
                                  defaultValue="The nucleus contains the cell's genetic material and controls cell activities."
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>Hotspot 2</Label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    placeholder="Title"
                                    defaultValue="Mitochondria"
                                  />
                                  <Input
                                    placeholder="X position"
                                    defaultValue="33%"
                                    className="w-20"
                                  />
                                  <Input
                                    placeholder="Y position"
                                    defaultValue="50%"
                                    className="w-20"
                                  />
                                </div>
                                <Textarea
                                  placeholder="Description"
                                  defaultValue="Mitochondria are the powerhouses of the cell, producing energy through cellular respiration."
                                  className="mt-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Hotspot
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-1" />
                                Change Image
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="interactive-2">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <span>Multisensory Learning Activity</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Volume2 className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Audio Component
                                  </h4>
                                </div>
                                <div className="space-y-2">
                                  <Label>Audio Title</Label>
                                  <Input defaultValue="Cell Processes Audio" />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                    >
                                      <Upload className="h-4 w-4 mr-1" />
                                      Upload Audio
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-shrink-0"
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <ImageIcon className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Visual Component
                                  </h4>
                                </div>
                                <div className="space-y-2">
                                  <Label>Visual Title</Label>
                                  <Input defaultValue="Cell Animations" />
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                    >
                                      <Upload className="h-4 w-4 mr-1" />
                                      Upload Video
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-shrink-0"
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Cube className="h-5 w-5 text-primary" />
                                  <h4 className="font-medium">
                                    Tactile Component
                                  </h4>
                                </div>
                                <div className="space-y-2">
                                  <Label>Activity Title</Label>
                                  <Input defaultValue="Interactive Cell Building" />
                                  <Select defaultValue="drag-drop">
                                    <SelectTrigger>
                                      <SelectValue placeholder="Activity Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="drag-drop">
                                        Drag and Drop
                                      </SelectItem>
                                      <SelectItem value="puzzle">
                                        Puzzle
                                      </SelectItem>
                                      <SelectItem value="simulation">
                                        Simulation
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">
                                <Save className="h-4 w-4 mr-1" />
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <div className="mt-4">
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          Add New Interactive Element
                        </Button>
                      </div>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Replace the existing 3D Models tab content with this */}
              <TabsContent value="3d-models" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>3D Models</CardTitle>
                    <CardDescription>
                      Upload and configure 3D models for interactive learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Map through the 3D models */}
                      {models3D.map((model) => (
                        <div key={model.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">
                              {model.id.startsWith("temp-") ? (
                                <span className="flex items-center">
                                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                                  Uploading...
                                </span>
                              ) : (
                                model.title
                              )}
                            </h3>
                            <Badge>Active</Badge>
                          </div>

                          {/* 3D Model Viewer */}
                          <div className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden">
                            {model.id.startsWith("temp-") ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-md">
                                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                                <p className="text-sm">Uploading 3D model...</p>
                              </div>
                            ) : (
                              // Use the SimpleModelViewer instead
                              <SimpleModelViewer
                                modelPath={model.modelPath}
                                height="300px"
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Model Title</Label>
                              <Input
                                value={model.title}
                                onChange={(e) => {
                                  update3DModel(model.id, {
                                    title: e.target.value,
                                  });
                                }}
                                className="mt-1"
                                disabled={model.id.startsWith("temp-")}
                              />
                            </div>
                            <div>
                              <Label>Model File</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  value={
                                    model.modelPath.split("/").pop() ||
                                    model.format
                                  }
                                  readOnly
                                  className="bg-muted"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={model.id.startsWith("temp-")}
                                  onClick={() => handle3DModelUpload()}
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={model.description}
                                onChange={(e) => {
                                  update3DModel(model.id, {
                                    description: e.target.value,
                                  });
                                }}
                                className="mt-1"
                                disabled={model.id.startsWith("temp-")}
                                placeholder="Describe this 3D model and how students should interact with it"
                              />
                            </div>
                          </div>

                          {/* Delete button - only show if not uploading */}
                          {!model.id.startsWith("temp-") && (
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => delete3DModel(model.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Model
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Upload button */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handle3DModelUpload}
                        disabled={isUploading3D}
                      >
                        {isUploading3D ? (
                          <>
                            <div className="animate-spin mr-1 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Upload New 3D Model
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Tab Content */}
              <TabsContent value="quiz" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Quiz Questions</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addQuizQuestion}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </Button>
                    </div>
                    <CardDescription>
                      Create assessment questions for this chapter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {quizQuestions.map((question, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">
                              Question {index + 1}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuizQuestion(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>Question Text</Label>
                              <Textarea
                                value={question.question}
                                onChange={(e) => {
                                  const newQuestions = [...quizQuestions];
                                  newQuestions[index].question = e.target.value;
                                  setQuizQuestions(newQuestions);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="mb-2 block">
                                Answer Options
                              </Label>
                              <div className="space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <RadioGroup
                                      value={question.correctAnswer.toString()}
                                      onValueChange={(value) => {
                                        const newQuestions = [...quizQuestions];
                                        newQuestions[index].correctAnswer =
                                          Number.parseInt(value);
                                        setQuizQuestions(newQuestions);
                                      }}
                                      className="flex-shrink-0"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={optIndex.toString()}
                                          id={`q${index}-opt${optIndex}`}
                                        />
                                      </div>
                                    </RadioGroup>
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newQuestions = [...quizQuestions];
                                        newQuestions[index].options[optIndex] =
                                          e.target.value;
                                        setQuizQuestions(newQuestions);
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const newQuestions = [...quizQuestions];
                                        newQuestions[index].options =
                                          newQuestions[index].options.filter(
                                            (_, i) => i !== optIndex
                                          );
                                        setQuizQuestions(newQuestions);
                                      }}
                                      disabled={question.options.length <= 2}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  const newQuestions = [...quizQuestions];
                                  newQuestions[index].options.push(
                                    `Option ${
                                      newQuestions[index].options.length + 1
                                    }`
                                  );
                                  setQuizQuestions(newQuestions);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Option
                              </Button>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Checkbox id={`explanation-${index}`} />
                                <Label htmlFor={`explanation-${index}`}>
                                  Include explanation for correct answer
                                </Label>
                              </div>
                              <Textarea
                                placeholder="Explanation for the correct answer"
                                className="mt-2"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Quiz Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Time Limit</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              defaultValue="15"
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">
                              minutes
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label>Passing Score</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              defaultValue="70"
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <Checkbox id="randomize-questions" defaultChecked />
                            <Label htmlFor="randomize-questions">
                              Randomize question order
                            </Label>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <Checkbox id="show-answers" defaultChecked />
                            <Label htmlFor="show-answers">
                              Show correct answers after submission
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Save button for quiz */}
                    <div className="mt-6 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveContent}
                        className="mr-2"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save Draft
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          saveContent();
                          setShowPublishDialog(true);
                        }}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save & Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>
                  Configure accessibility features for this content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="text-to-speech">Text-to-Speech</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable reading content aloud
                      </p>
                    </div>
                    <Switch
                      id="text-to-speech"
                      checked={enableTTS}
                      onCheckedChange={setEnableTTS}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emotion-detection">
                        Emotion Detection
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Adapt content based on student emotions
                      </p>
                    </div>
                    <Switch
                      id="emotion-detection"
                      checked={enableEmotionDetection}
                      onCheckedChange={setEnableEmotionDetection}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="adaptive-content">Adaptive Content</Label>
                      <p className="text-xs text-muted-foreground">
                        Show different content based on needs
                      </p>
                    </div>
                    <Switch
                      id="adaptive-content"
                      checked={enableAdaptiveContent}
                      onCheckedChange={setEnableAdaptiveContent}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sign-language">
                        Sign Language Converter
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Convert audio to sign language
                      </p>
                    </div>
                    <Switch
                      id="sign-language"
                      checked={enableSignLanguage}
                      onCheckedChange={setEnableSignLanguage}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-navigation">Voice Navigation</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow navigation via voice commands
                      </p>
                    </div>
                    <Switch
                      id="voice-navigation"
                      checked={enableVoiceNavigation}
                      onCheckedChange={setEnableVoiceNavigation}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>
                  Overview of student engagement with this content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Completion Rate
                      </span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Average Quiz Score
                      </span>
                      <span className="text-sm text-muted-foreground">76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Engagement Time
                      </span>
                      <span className="text-sm text-muted-foreground">
                        18 min avg
                      </span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart className="h-4 w-4 mr-1" />
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Content Schedule</CardTitle>
                <CardDescription>
                  Manage when this content is available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Release Date</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="date" defaultValue="2025-04-10" />
                      <Input type="time" defaultValue="08:00" />
                    </div>
                  </div>

                  <div>
                    <Label>Due Date</Label>
                    <div className="flex gap-2 mt-1">
                      <Input type="date" defaultValue="2025-04-17" />
                      <Input type="time" defaultValue="23:59" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="send-notification" defaultChecked />
                    <Label htmlFor="send-notification">
                      Send notification when published
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="reminder-notification" defaultChecked />
                    <Label htmlFor="reminder-notification">
                      Send reminder 24h before due date
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Notes for Teachers</CardTitle>
                <CardDescription>
                  Private notes only visible to teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add notes about teaching this content..."
                  className="min-h-[100px]"
                  defaultValue="Focus on helping students understand the relationship between cell structure and function. The 3D model is particularly helpful for visual learners. Students with dyslexia may need extra time with the text content."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Content</DialogTitle>
            <DialogDescription>
              This will make the content visible to students according to your
              schedule settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Content Checklist</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Checkbox id="check-text" defaultChecked />
                    <Label htmlFor="check-text">Text content is complete</Label>
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox id="check-images" defaultChecked />
                    <Label htmlFor="check-images">Images have alt text</Label>
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox id="check-adaptive" defaultChecked />
                    <Label htmlFor="check-adaptive">
                      Adaptive content versions are provided
                    </Label>
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox id="check-quiz" defaultChecked />
                    <Label htmlFor="check-quiz">
                      Quiz questions have correct answers marked
                    </Label>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Label>Publish to</Label>
              <Select defaultValue="all">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="group-a">Group A</SelectItem>
                  <SelectItem value="group-b">Group B</SelectItem>
                  <SelectItem value="individual">
                    Select Individual Students
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowPublishDialog(false)}>
              Publish Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} className="hidden" />
    </div>
  );
}
