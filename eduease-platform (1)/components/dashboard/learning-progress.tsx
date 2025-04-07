import { Progress } from "@/components/ui/progress"

export function LearningProgress() {
  const subjects = [
    {
      name: "Mathematics",
      progress: 65,
      color: "bg-blue-500",
      icon: "📐",
    },
    {
      name: "Reading & Language",
      progress: 78,
      color: "bg-green-500",
      icon: "📚",
    },
    {
      name: "Science",
      progress: 42,
      color: "bg-purple-500",
      icon: "🔬",
    },
    {
      name: "Social Studies",
      progress: 55,
      color: "bg-amber-500",
      icon: "🌎",
    },
  ]

  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <div key={subject.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-2">{subject.icon}</span>
              <span className="font-medium">{subject.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">{subject.progress}%</span>
              <div className={`w-3 h-3 rounded-full ${subject.progress > 70 ? 'bg-green-500' : subject.progress > 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
            </div>
          </div>
          <div className="relative">
            <Progress value={subject.progress} className={`h-2 ${subject.color}`} />
            {subject.progress >= 75 && (
              <div className="absolute -right-1 -top-1">
                <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Great!
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}