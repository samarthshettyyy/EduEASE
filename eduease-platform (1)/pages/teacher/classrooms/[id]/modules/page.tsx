// pages/teacher/classrooms/[id]/modules/page.tsx

"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ClassroomModulesPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [formData, setFormData] = useState({
    content: null,
    interactive: null,
    model3D: null,
    quiz: null,
    textToSpeech: false,
    emotionDetection: false,
    voiceNavigation: false,
    signLanguage: false
  });

  const handleFileChange = (e: any, type: string) => {
    setFormData({ ...formData, [type]: e.target.files[0] });
  };

  const handleToggle = (type: string) => {
    setFormData({ ...formData, [type]: !formData[type as keyof typeof formData] });
  };

  const handleSubmit = async () => {
    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) body.append(key, value);
    });

    const res = await fetch("/api/modules/upload", {
      method: "POST",
      body
    });

    if (res.ok) alert("Module uploaded successfully");
    else alert("Upload failed");
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Module Content</h1>
      <Tabs defaultValue="content" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
          <TabsTrigger value="model3D">3D Models</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Label>Upload PDF Content</Label>
          <Input type="file" accept="application/pdf" onChange={e => handleFileChange(e, "content")} />
        </TabsContent>
        <TabsContent value="interactive">
          <Label>Upload Interactive File</Label>
          <Input type="file" onChange={e => handleFileChange(e, "interactive")} />
        </TabsContent>
        <TabsContent value="model3D">
          <Label>Upload 3D Model File</Label>
          <Input type="file" onChange={e => handleFileChange(e, "model3D")} />
        </TabsContent>
        <TabsContent value="quiz">
          <Label>Upload Quiz File</Label>
          <Input type="file" onChange={e => handleFileChange(e, "quiz")} />
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Switch checked={formData.textToSpeech} onCheckedChange={() => handleToggle("textToSpeech")} />
          <Label>Text to Speech</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.emotionDetection} onCheckedChange={() => handleToggle("emotionDetection")} />
          <Label>Emotion Detection</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.voiceNavigation} onCheckedChange={() => handleToggle("voiceNavigation")} />
          <Label>Voice Navigation</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.signLanguage} onCheckedChange={() => handleToggle("signLanguage")} />
          <Label>Sign Language Converter</Label>
        </div>
      </div>

      <Button className="mt-6" onClick={handleSubmit}>Submit Module</Button>

      <div className="mt-10">
        <Button variant="secondary">Talk to Telegram Bot</Button>
      </div>
    </div>
  );
}
