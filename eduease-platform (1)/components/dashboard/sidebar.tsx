"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BookOpen, Calendar, Home, MessageSquare, Settings, 
  User, Video, BarChart, LogOut, Bell, HelpCircle 
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar as SidebarComponent,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <SidebarProvider>
      <SidebarComponent className="border-r">
        <SidebarHeader className="flex items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">EduEase</span>
          </div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>
        
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="Alex Johnson" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Alex Johnson</div>
              <div className="text-xs text-muted-foreground">Grade 5 Student</div>
            </div>
          </div>
        </div>
        
        <SidebarSeparator />
        
        <SidebarContent>
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning
            </h3>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link href="/dashboard" className="flex items-center">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/lessons")}>
                <Link href="/dashboard/lessons" className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5" />
                    <span>Lessons</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto">3</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/schedule")}>
                <Link href="/dashboard/schedule">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/video-sessions")}>
                <Link href="/dashboard/video-sessions">
                  <Video className="h-5 w-5" />
                  <span>Video Sessions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/progress")}>
                <Link href="/dashboard/progress">
                  <BarChart className="h-5 w-5" />
                  <span>Progress</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <div className="mt-4 px-4 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Support
            </h3>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/chat")}>
                <Link href="/dashboard/chat" className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5" />
                    <span>AI Assistant</span>
                  </div>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary">NEW</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/notifications")}>
                <Link href="/dashboard/notifications">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/help")}>
                <Link href="/dashboard/help">
                  <HelpCircle className="h-5 w-5" />
                  <span>Help Center</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarSeparator />
        
        <SidebarFooter className="pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/profile")}>
                <Link href="/dashboard/profile">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                <Link href="/dashboard/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Link href="/logout">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarComponent>
    </SidebarProvider>
  )
}