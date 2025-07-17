import * as React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  X, 
  Volume2, 
  VolumeX,
  Info,
  CheckCircle,
  Clock
} from "lucide-react"
import { cn } from "@/lib/utils"

export type AlertSeverity = 'emergency' | 'warning' | 'info' | 'success'
export type AlertPriority = 'high' | 'medium' | 'low'

interface AlertBannerProps {
  severity: AlertSeverity
  priority?: AlertPriority
  title: string
  message: string
  showSound?: boolean
  soundEnabled?: boolean
  onSoundToggle?: () => void
  showDismiss?: boolean
  onDismiss?: () => void
  autoHideAfter?: number
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive'
  }>
  className?: string
}

const severityConfig = {
  emergency: {
    icon: AlertTriangle,
    className: "border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100",
    iconColor: "text-red-600",
    pulse: true
  },
  warning: {
    icon: AlertTriangle,
    className: "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100",
    iconColor: "text-orange-600",
    pulse: false
  },
  info: {
    icon: Info,
    className: "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100",
    iconColor: "text-blue-600",
    pulse: false
  },
  success: {
    icon: CheckCircle,
    className: "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100",
    iconColor: "text-green-600",
    pulse: false
  }
} as const

export function AlertBanner({
  severity,
  priority = 'medium',
  title,
  message,
  showSound = false,
  soundEnabled = false,
  onSoundToggle,
  showDismiss = true,
  onDismiss,
  autoHideAfter,
  actions = [],
  className
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const config = severityConfig[severity]
  const Icon = config.icon

  // Auto-hide timer
  React.useEffect(() => {
    if (!autoHideAfter || !isVisible) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, autoHideAfter * 1000)

    return () => clearTimeout(timer)
  }, [autoHideAfter, isVisible, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <Alert className={cn(
      "relative border-l-4 shadow-md transition-all duration-300",
      config.className,
      priority === 'high' && "border-l-8",
      config.pulse && severity === 'emergency' && "animate-pulse",
      className
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0 mt-0.5",
          config.iconColor,
          config.pulse && "animate-pulse"
        )} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <AlertDescription className="text-sm leading-relaxed">
                {message}
              </AlertDescription>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {showSound && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onSoundToggle}
                  className="h-8 w-8 p-0"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              {showDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "outline"}
                  onClick={action.onClick}
                  className="h-8 text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* High priority indicator */}
      {priority === 'high' && (
        <div className="absolute top-2 left-1 w-1 h-6 bg-current opacity-80 rounded-r" />
      )}
    </Alert>
  )
}

// Preset alert banners for common emergency scenarios
export function EmergencyAlert(props: Omit<AlertBannerProps, 'severity'>) {
  return <AlertBanner severity="emergency" priority="high" {...props} />
}

export function WarningAlert(props: Omit<AlertBannerProps, 'severity'>) {
  return <AlertBanner severity="warning" {...props} />
}

export function InfoAlert(props: Omit<AlertBannerProps, 'severity'>) {
  return <AlertBanner severity="info" {...props} />
}

export function SuccessAlert(props: Omit<AlertBannerProps, 'severity'>) {
  return <AlertBanner severity="success" {...props} />
}