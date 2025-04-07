import { BookOpen, FileText, Video, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecommendedResources() {
  const resources = [
    {
      id: 1,
      title: "Dyslexia-Friendly Reading Practice",
      description: "Interactive exercises to improve reading comprehension",
      type: "interactive",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-800",
      subject: "Reading"
    },
    {
      id: 2,
      title: "Visual Math Concepts",
      description: "Video explanations of fractions and decimals",
      type: "video",
      icon: Video,
      color: "bg-green-100 text-green-800",
      subject: "Math"
    },
    {
      id: 3,
      title: "Science Vocabulary Flashcards",
      description: "Key terms for the solar system unit",
      type: "document",
      icon: FileText,
      color: "bg-purple-100 text-purple-800",
      subject: "Science"
    },
  ]

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div 
          key={resource.id} 
          className="flex flex-col rounded-lg border hover:border-primary hover:shadow-sm transition-all duration-200"
        >
          <div className="p-4 flex items-center space-x-3">
            <div className="rounded-full bg-primary/10 p-2">
              <resource.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium">{resource.title}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs ${resource.color}`}>
                  {resource.subject}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
            </div>
          </div>
          <div className="border-t px-4 py-2 flex justify-between items-center">
            <span className="text-xs capitalize flex items-center">
              <resource.icon className="h-3 w-3 mr-1 text-muted-foreground" />
              {resource.type}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-primary hover:text-primary hover:bg-primary/5">
              Open
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View All Resources
      </Button>
    </div>
  )
}