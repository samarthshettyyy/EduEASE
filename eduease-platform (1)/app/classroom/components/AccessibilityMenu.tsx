"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  SunMoon, 
  ZoomIn, 
  Type, 
  MousePointer, 
  RefreshCw, 
  X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

interface AccessibilityOptions {
  highContrast: boolean;
  largeText: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  highlightFocus: boolean;
  textToSpeech: boolean;
}

export default function AccessibilityMenu(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<AccessibilityOptions>({
    highContrast: false,
    largeText: false,
    dyslexicFont: false,
    reducedMotion: false,
    highlightFocus: false,
    textToSpeech: false,
  })

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedOptions = localStorage.getItem('accessibilityOptions')
    if (savedOptions) {
      setOptions(JSON.parse(savedOptions))
      applyAccessibilitySettings(JSON.parse(savedOptions))
    }
  }, [])

  // Save preferences to localStorage and apply them whenever they change
  useEffect(() => {
    localStorage.setItem('accessibilityOptions', JSON.stringify(options))
    applyAccessibilitySettings(options)
  }, [options])

  // Apply all accessibility settings
  const applyAccessibilitySettings = (settings: AccessibilityOptions): void => {
    // High contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast-mode')
    } else {
      document.documentElement.classList.remove('high-contrast-mode')
    }

    // Large text
    if (settings.largeText) {
      document.documentElement.classList.add('large-text-mode')
    } else {
      document.documentElement.classList.remove('large-text-mode')
    }

    // Dyslexic friendly font
    if (settings.dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font')
    } else {
      document.documentElement.classList.remove('dyslexic-font')
    }

    // Reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }

    // Focus highlighting
    if (settings.highlightFocus) {
      document.documentElement.classList.add('highlight-focus')
    } else {
      document.documentElement.classList.remove('highlight-focus')
    }
  }

  // Toggle a specific option
  const toggleOption = (option: keyof AccessibilityOptions): void => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  // Reset all options
  const resetOptions = (): void => {
    const defaultOptions: AccessibilityOptions = {
      highContrast: false,
      largeText: false,
      dyslexicFont: false,
      reducedMotion: false,
      highlightFocus: false,
      textToSpeech: false,
    }
    setOptions(defaultOptions)
  }

  return (
    <>
      {/* Floating accessibility button */}
      <div className="fixed bottom-6 right-6 z-50">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90"
              aria-label="Accessibility options"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-4" align="end">
            <div className="flex items-center justify-between mb-4">
              <DropdownMenuLabel className="text-lg font-bold">Accessibility Settings</DropdownMenuLabel>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="space-y-4 py-2">
              {/* High contrast mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SunMoon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-xs text-muted-foreground">Enhances text visibility</p>
                  </div>
                </div>
                <Switch 
                  checked={options.highContrast} 
                  onCheckedChange={() => toggleOption('highContrast')} 
                  aria-label="Toggle high contrast"
                />
              </div>
              
              {/* Text size */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ZoomIn className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Larger Text</p>
                    <p className="text-xs text-muted-foreground">Increases text size</p>
                  </div>
                </div>
                <Switch 
                  checked={options.largeText} 
                  onCheckedChange={() => toggleOption('largeText')} 
                  aria-label="Toggle larger text"
                />
              </div>
              
              {/* Dyslexic font */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Dyslexic Font</p>
                    <p className="text-xs text-muted-foreground">Uses dyslexia-friendly typography</p>
                  </div>
                </div>
                <Switch 
                  checked={options.dyslexicFont} 
                  onCheckedChange={() => toggleOption('dyslexicFont')} 
                  aria-label="Toggle dyslexic font"
                />
              </div>
              
              {/* Reduced motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Reduced Motion</p>
                    <p className="text-xs text-muted-foreground">Minimizes animations</p>
                  </div>
                </div>
                <Switch 
                  checked={options.reducedMotion} 
                  onCheckedChange={() => toggleOption('reducedMotion')} 
                  aria-label="Toggle reduced motion"
                />
              </div>
              
              {/* Focus highlighting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MousePointer className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Focus Highlighting</p>
                    <p className="text-xs text-muted-foreground">Enhanced focus indicators</p>
                  </div>
                </div>
                <Switch 
                  checked={options.highlightFocus} 
                  onCheckedChange={() => toggleOption('highlightFocus')} 
                  aria-label="Toggle focus highlighting"
                />
              </div>
            </div>
            
            <DropdownMenuSeparator className="my-2" />
            
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={resetOptions}
            >
              Reset to Default
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* CSS for the accessibility features */}
      <style jsx global>{`
        /* High Contrast Mode */
        .high-contrast-mode {
          --background: #000000;
          --foreground: #ffffff;
          --muted: #333333;
          --muted-foreground: #f5f5f5;
          --primary: #ffff00;
          --primary-foreground: #000000;
          --border: #ffffff;
          color-scheme: dark;
        }
        
        .high-contrast-mode .bg-background {
          background-color: #000000 !important;
        }
        
        .high-contrast-mode p, .high-contrast-mode h1, .high-contrast-mode h2, 
        .high-contrast-mode h3, .high-contrast-mode span {
          color: #ffffff !important;
        }
        
        .high-contrast-mode a {
          color: #ffff00 !important;
          text-decoration: underline;
        }
        
        .high-contrast-mode button {
          border: 2px solid #ffffff !important;
        }
        
        /* Large Text Mode */
        .large-text-mode {
          font-size: 120% !important;
        }
        
        .large-text-mode h1 {
          font-size: 2.5rem !important;
        }
        
        .large-text-mode h2 {
          font-size: 2rem !important;
        }
        
        .large-text-mode h3 {
          font-size: 1.75rem !important;
        }
        
        .large-text-mode p, .large-text-mode span, .large-text-mode button {
          font-size: 1.2rem !important;
        }
        
        /* Dyslexic Font */
        .dyslexic-font {
          font-family: "OpenDyslexic", sans-serif !important;
          letter-spacing: 0.05em;
          word-spacing: 0.15em;
          line-height: 1.5;
        }
        
        /* Reduced Motion */
        .reduced-motion * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
        
        /* Focus Highlighting */
        .highlight-focus *:focus {
          outline: 3px solid #ffff00 !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </>
  )
}