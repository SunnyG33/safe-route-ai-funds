import * as React from "react"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Phone, 
  Radio, 
  Siren, 
  Zap,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

export type EmergencyAction = 
  | 'alert'
  | 'call'
  | 'radio' 
  | 'siren'
  | 'emergency'
  | 'message'

interface EmergencyButtonProps extends React.ComponentProps<typeof Button> {
  action: EmergencyAction
  label?: string
  countdown?: number
  isActive?: boolean
  pulseOnActive?: boolean
  onCountdownComplete?: () => void
}

const actionConfig = {
  alert: {
    icon: AlertTriangle,
    defaultLabel: "Send Alert",
    variant: "destructive",
    className: "bg-red-600 hover:bg-red-700 text-white border-red-700"
  },
  call: {
    icon: Phone,
    defaultLabel: "Emergency Call",
    variant: "destructive", 
    className: "bg-red-600 hover:bg-red-700 text-white border-red-700"
  },
  radio: {
    icon: Radio,
    defaultLabel: "Radio Dispatch",
    variant: "secondary",
    className: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
  },
  siren: {
    icon: Siren,
    defaultLabel: "Activate Siren",
    variant: "destructive",
    className: "bg-orange-600 hover:bg-orange-700 text-white border-orange-700"
  },
  emergency: {
    icon: Zap,
    defaultLabel: "Emergency Protocol",
    variant: "destructive",
    className: "bg-red-800 hover:bg-red-900 text-white border-red-900"
  },
  message: {
    icon: MessageSquare,
    defaultLabel: "Emergency Message",
    variant: "secondary",
    className: "bg-green-600 hover:bg-green-700 text-white border-green-700"
  }
} as const

export function EmergencyButton({
  action,
  label,
  countdown,
  isActive = false,
  pulseOnActive = true,
  onCountdownComplete,
  className,
  children,
  ...props
}: EmergencyButtonProps) {
  const [internalCountdown, setInternalCountdown] = React.useState<number | null>(countdown ?? null)
  const config = actionConfig[action]
  const Icon = config.icon
  
  const displayLabel = label || config.defaultLabel

  // Countdown effect
  React.useEffect(() => {
    if (internalCountdown === null || internalCountdown <= 0) return

    const timer = setTimeout(() => {
      if (internalCountdown === 1) {
        onCountdownComplete?.()
        setInternalCountdown(null)
      } else {
        setInternalCountdown(internalCountdown - 1)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [internalCountdown, onCountdownComplete])

  // Reset countdown when prop changes
  React.useEffect(() => {
    setInternalCountdown(countdown ?? null)
  }, [countdown])

  return (
    <Button
      variant={config.variant as any}
      className={cn(
        config.className,
        "relative font-semibold transition-all duration-200",
        "focus:ring-4 focus:ring-offset-2",
        isActive && pulseOnActive && "animate-pulse",
        isActive && "ring-2 ring-white ring-offset-2",
        internalCountdown && "cursor-wait opacity-75",
        className
      )}
      disabled={internalCountdown !== null || props.disabled}
      {...props}
    >
      <Icon className="mr-2 h-4 w-4" />
      
      {internalCountdown ? (
        <span className="flex items-center gap-2">
          {displayLabel} ({internalCountdown}s)
          <div className="h-3 w-3 rounded-full bg-white/30 animate-ping" />
        </span>
      ) : (
        children || displayLabel
      )}
      
      {/* Active indicator */}
      {isActive && !internalCountdown && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full animate-ping" />
      )}
    </Button>
  )
}

// Preset emergency buttons for common scenarios
export function AlertButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="alert" {...props} />
}

export function EmergencyCallButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="call" {...props} />
}

export function RadioDispatchButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="radio" {...props} />
}

export function SirenButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="siren" {...props} />
}

export function EmergencyProtocolButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="emergency" {...props} />
}

export function EmergencyMessageButton(props: Omit<EmergencyButtonProps, 'action'>) {
  return <EmergencyButton action="message" {...props} />
}