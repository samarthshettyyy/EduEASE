"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BookOpen,
    Plus,
    Settings,
    MoreVertical,
    Edit,
    Copy,
    Trash2,
    Eye,
    ArrowLeft,
    Calendar,
    Users,
    BarChart,
    Clock,
    CheckCircle,
    FileText,
    GripVertical,
    MoveUp,
    MoveDown,
    Lock,
    Unlock,
    Upload,
} from "lucide-react"

// Module type definition
type Module = {
    id: string
    title: string
    description: string
    status: "draft" | "published" | "scheduled" | "archived"
    studentProgress: number
    lastUpdated: string
    dueDate?: string
    chapters: number
    quizzes: number
    isLocked: boolean
    prerequisites?: string[]
}

export default function TeacherCourseModulesPage() {

    const user = JSON.parse(localStorage.getItem("user"));

    const params = useParams()
    const router = useRouter()
    const courseId = params.id
    const classroomId = params.id
    const [activeTab, setActiveTab] = useState("all")
    const [showNewModuleDialog, setShowNewModuleDialog] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [newModuleTitle, setNewModuleTitle] = useState("")
    const [newModuleDescription, setNewModuleDescription] = useState("")
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState();

    // Filter modules based on search query and active tab
    const filteredModules = modules.filter((module) => {
        const matchesSearch =
            module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.description.toLowerCase().includes(searchQuery.toLowerCase())

        if (activeTab === "all") return matchesSearch
        if (activeTab === "published") return matchesSearch && module.status === "published"
        if (activeTab === "draft") return matchesSearch && module.status === "draft"
        if (activeTab === "scheduled") return matchesSearch && module.status === "scheduled"
        if (activeTab === "archived") return matchesSearch && module.status === "archived"

        return matchesSearch
    })

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
            setLoading(true);
            const fetchedModules = await fetchModules(classroomId);
            setModules(fetchedModules);
            setLoading(false);
        };

        loadModules();
    }, [classroomId]);

    // Handle creating a new module
    const handleCreateModule = async () => {
        // In a real app, this would create a new module in the database
        if (!classroomId) {
            alert("Classroom ID is missing.");
            return;
        }

        // Send the data to the backend
        const response = await fetch("/api/teacher/modules/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: newModuleTitle,
                description: newModuleDescription,
                classroomId: parseInt(classroomId), // Pass classroomId as part of the request
            }),
        });

        if (response.ok) {
            alert("Module created successfully");
            setShowNewModuleDialog(false); // Close dialog after creation
        } else {
            alert("Error creating module");
        }
        setShowNewModuleDialog(false)
        // Reset form
        setNewModuleTitle("")
        setNewModuleDescription("")
        // Navigate to the new module (using a placeholder ID for now)
    }

    // Handle editing a module
    const handleEditModule = (moduleId: string) => {
        router.push(`/teacher/classroom/${moduleId}`)
    }

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
                            <span>Back to Courses</span>
                        </Link>
                        <div className="h-4 w-px bg-muted" />
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            <span className="text-lg font-medium">Biology 101</span>
                            <span className="text-sm text-muted-foreground">{user.name}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/teacher/course/${courseId}/settings`}>
                            <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/teacher/course/${courseId}/students`}>
                            <Button variant="ghost" size="icon">
                                <Users className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/teacher/course/${courseId}/analytics`}>
                            <Button variant="ghost" size="icon">
                                <BarChart className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Preview Course
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 py-6">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Course Modules</h1>
                            <p className="text-muted-foreground mt-1">Manage and organize your course content</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => setShowNewModuleDialog(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                New Module
                            </Button>
                            <Select defaultValue="newest">
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                                    <SelectItem value="custom">Custom Order</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Total Modules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold">{modules.length}</div>
                                    <div className="text-xs text-muted-foreground">modules</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Published</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold">{modules.filter((m) => m.status === "published").length}</div>
                                    <div className="text-xs text-muted-foreground">modules</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Average Completion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold">
                                        {Math.round(modules.reduce((acc, m) => acc + m.studentProgress, 0) / modules.length)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">by students</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Upcoming Due Dates</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <div className="text-3xl font-bold">{modules.filter((m) => m.dueDate).length}</div>
                                    <div className="text-xs text-muted-foreground">modules</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-6">
                        <Input
                            placeholder="Search modules..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList>
                            <TabsTrigger value="all">All Modules</TabsTrigger>
                            <TabsTrigger value="published">Published</TabsTrigger>
                            <TabsTrigger value="draft">Drafts</TabsTrigger>
                            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                            <TabsTrigger value="archived">Archived</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredModules.length === 0 ? (
                            <div className="col-span-full text-center py-12 border rounded-lg">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No modules found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? "Try a different search term" : "Create your first module to get started"}
                                </p>
                                <Button onClick={() => setShowNewModuleDialog(true)}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    New Module
                                </Button>
                            </div>
                        ) : (
                            filteredModules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    onEdit={() => handleEditModule(module.id)}
                                />
                            ))
                        )}
                    </div>


                    {filteredModules.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Button variant="outline" onClick={() => setShowNewModuleDialog(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add Another Module
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* New Module Dialog */}
            <Dialog open={showNewModuleDialog} onOpenChange={setShowNewModuleDialog}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Create New Module</DialogTitle>
                        <DialogDescription>
                            Add a new module to your course. You can add chapters and content after creating the module.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="module-title">Module Title</Label>
                            <Input
                                id="module-title"
                                placeholder="e.g., Introduction to Cell Biology"
                                value={newModuleTitle}
                                onChange={(e) => setNewModuleTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="module-description">Description</Label>
                            <Textarea
                                id="module-description"
                                placeholder="Brief description of the module content and learning objectives"
                                value={newModuleDescription}
                                onChange={(e) => setNewModuleDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Module Settings</Label>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Switch id="lock-module" />
                                    <Label htmlFor="lock-module">Lock module (requires prerequisites)</Label>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Content Import (Optional)</Label>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Import from existing module" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Start from scratch)</SelectItem>
                                        <SelectItem value="cell-theory">Cell Theory</SelectItem>
                                        <SelectItem value="cell-structure">Cell Structure</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewModuleDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateModule} disabled={!newModuleTitle.trim()}>
                            Create Module
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Module Card Component
function ModuleCard({ module, onEdit }: { module: Module; onEdit: () => void }) {
    const getStatusBadge = (status: Module["status"]) => {
        switch (status) {
            case "published":
                return <Badge className="bg-green-500">Published</Badge>
            case "draft":
                return <Badge variant="outline">Draft</Badge>
            case "scheduled":
                return <Badge className="bg-blue-500">Scheduled</Badge>
            case "archived":
                return <Badge variant="secondary">Archived</Badge>
            default:
                return <Badge className="bg-green-500">Published</Badge>
        }
    }

    return (
        <div className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                </div>
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-medium">{module.name}</h3>
                                {getStatusBadge(module.status)}
                            </div>
                            <p className="text-l text-muted-foreground mt-1">{module.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Module Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MoveUp className="h-4 w-4 mr-2" />
                                        Move Up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MoveDown className="h-4 w-4 mr-2" />
                                        Move Down
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {module.isLocked ? (
                                        <DropdownMenuItem>
                                            <Unlock className="h-4 w-4 mr-2" />
                                            Unlock Module
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem>
                                            <Lock className="h-4 w-4 mr-2" />
                                            Lock Module
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}