import { BookOpen, FileText, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecommendedResources() {
  const resources = [
    {
      id: 1,
      title: "Dyslexia-Friendly Reading Practice",
      type: "interactive",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Visual Math Concepts",
      type: "video",
      icon: Video,
    },
    {
      id: 3,
      title: "Science Vocabulary Flashcards",
      type: "document",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-primary/10 p-2">
              <resource.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{resource.title}</h4>
              <p className="text-xs capitalize text-muted-foreground">{resource.type}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View All Resources
      </Button>
    </div>
  )
}

