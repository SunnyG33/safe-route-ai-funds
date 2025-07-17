import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  X, 
  Radio,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero
} from "lucide-react"
import { cn } from "@/lib/utils"

export type SystemStatus = 'online' | 'offline' | 'degraded' | 'maintenance'
export type ConnectionStatus = 'connected' | 'disconnected' | 'poor' | 'excellent'
export type BatteryLevel = 'critical' | 'low' | 'medium' | 'high' | 'full'
export type SignalStrength = 'none' | 'poor' | 'fair' | 'good' | 'excellent'

interface StatusIndicatorProps {
  type: 'system' | 'connection' | 'battery' | 'signal'
  status: SystemStatus | ConnectionStatus | BatteryLevel | SignalStrength
  label?: string
  showLabel?: boolean
  showPulse?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const systemConfig = {
  online: { 
    icon: CheckCircle, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  },
  offline: { 
    icon: X, 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/20",
    variant: "destructive" as const,
    pulse: true
  },
  degraded: { 
    icon: AlertTriangle, 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    variant: "secondary" as const,
    pulse: true
  },
  maintenance: { 
    icon: Clock, 
    color: "text-blue-600", 
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    variant: "outline" as const,
    pulse: false
  }
}

const connectionConfig = {
  connected: { 
    icon: Wifi, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  },
  disconnected: { 
    icon: WifiOff, 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/20",
    variant: "destructive" as const,
    pulse: true
  },
  poor: { 
    icon: Wifi, 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    variant: "secondary" as const,
    pulse: false
  },
  excellent: { 
    icon: Wifi, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  }
}

const batteryConfig = {
  critical: { 
    icon: BatteryLow, 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/20",
    variant: "destructive" as const,
    pulse: true
  },
  low: { 
    icon: BatteryLow, 
    color: "text-orange-600", 
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    variant: "secondary" as const,
    pulse: false
  },
  medium: { 
    icon: Battery, 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    variant: "outline" as const,
    pulse: false
  },
  high: { 
    icon: Battery, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  },
  full: { 
    icon: Battery, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  }
}

const signalConfig = {
  none: { 
    icon: SignalZero, 
    color: "text-red-600", 
    bgColor: "bg-red-100 dark:bg-red-900/20",
    variant: "destructive" as const,
    pulse: true
  },
  poor: { 
    icon: SignalLow, 
    color: "text-orange-600", 
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    variant: "secondary" as const,
    pulse: false
  },
  fair: { 
    icon: Signal, 
    color: "text-yellow-600", 
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    variant: "outline" as const,
    pulse: false
  },
  good: { 
    icon: SignalHigh, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  },
  excellent: { 
    icon: SignalHigh, 
    color: "text-green-600", 
    bgColor: "bg-green-100 dark:bg-green-900/20",
    variant: "outline" as const,
    pulse: false
  }
}

const getConfig = (type: string, status: string) => {
  switch (type) {
    case 'system': return systemConfig[status as SystemStatus]
    case 'connection': return connectionConfig[status as ConnectionStatus]
    case 'battery': return batteryConfig[status as BatteryLevel]
    case 'signal': return signalConfig[status as SignalStrength]
    default: return systemConfig.offline
  }
}

const sizeConfig = {
  sm: { icon: "h-3 w-3", badge: "text-xs px-1.5 py-0.5" },
  md: { icon: "h-4 w-4", badge: "text-sm px-2 py-1" },
  lg: { icon: "h-5 w-5", badge: "text-base px-3 py-1.5" }
}

export function StatusIndicator({
  type,
  status,
  label,
  showLabel = true,
  showPulse = true,
  size = 'md',
  className
}: StatusIndicatorProps) {
  const config = getConfig(type, status)
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon
  
  const displayLabel = label || `${type} ${status}`

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-full p-1",
        config.bgColor,
        showPulse && config.pulse && "animate-pulse"
      )}>
        <Icon className={cn(sizeStyles.icon, config.color)} />
        
        {/* Status dot for additional emphasis */}
        <div className={cn(
          "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
          config.color.replace('text-', 'bg-'),
          showPulse && config.pulse && "animate-ping"
        )} />
      </div>
      
      {showLabel && (
        <Badge 
          variant={config.variant}
          className={cn(sizeStyles.badge, "font-medium")}
        >
          {displayLabel}
        </Badge>
      )}
    </div>
  )
}

// Preset status indicators for common use cases
export function SystemStatusIndicator(props: Omit<StatusIndicatorProps, 'type'>) {
  return <StatusIndicator type="system" {...props} />
}

export function ConnectionStatusIndicator(props: Omit<StatusIndicatorProps, 'type'>) {
  return <StatusIndicator type="connection" {...props} />
}

export function BatteryStatusIndicator(props: Omit<StatusIndicatorProps, 'type'>) {
  return <StatusIndicator type="battery" {...props} />
}

export function SignalStatusIndicator(props: Omit<StatusIndicatorProps, 'type'>) {
  return <StatusIndicator type="signal" {...props} />
}

// Combined status dashboard component
export function StatusDashboard({
  systemStatus,
  connectionStatus,
  batteryLevel,
  signalStrength,
  showLabels = true,
  className
}: {
  systemStatus: SystemStatus
  connectionStatus: ConnectionStatus
  batteryLevel: BatteryLevel
  signalStrength: SignalStrength
  showLabels?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <SystemStatusIndicator status={systemStatus} showLabel={showLabels} />
      <ConnectionStatusIndicator status={connectionStatus} showLabel={showLabels} />
      <BatteryStatusIndicator status={batteryLevel} showLabel={showLabels} />
      <SignalStatusIndicator status={signalStrength} showLabel={showLabels} />
    </div>
  )
}