import { Progress } from "@/components/ui/progress"

export function LearningProgress() {
  const subjects = [
    {
      name: "Mathematics",
      progress: 65,
      color: "bg-blue-500",
    },
    {
      name: "Reading & Language",
      progress: 78,
      color: "bg-green-500",
    },
    {
      name: "Science",
      progress: 42,
      color: "bg-purple-500",
    },
    {
      name: "Social Studies",
      progress: 55,
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <div key={subject.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">{subject.name}</span>
            <span className="text-muted-foreground">{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className={subject.color} />
        </div>
      ))}
    </div>
  )
}

