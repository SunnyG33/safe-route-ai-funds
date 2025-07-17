import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin,
  Radio
} from "lucide-react"
import { cn } from "@/lib/utils"

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'active' | 'responding' | 'resolved' | 'pending'

export interface IncidentData {
  id: string
  title: string
  description: string
  severity: IncidentSeverity
  status: IncidentStatus
  location: string
  reportedAt: Date
  assignedTeams: string[]
  contactMethod: string
  estimatedPersonsAffected: number
}

interface IncidentStatusCardProps {
  incident: IncidentData
  onRespond?: (incidentId: string) => void
  onViewDetails?: (incidentId: string) => void
  className?: string
}

const severityConfig = {
  critical: {
    badge: "destructive",
    icon: AlertTriangle,
    bgClass: "border-l-4 border-l-destructive bg-destructive/5"
  },
  high: {
    badge: "destructive",
    icon: AlertTriangle,
    bgClass: "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
  },
  medium: {
    badge: "secondary",
    icon: Clock,
    bgClass: "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
  },
  low: {
    badge: "outline",
    icon: Clock,
    bgClass: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
  }
} as const

const statusConfig = {
  active: { 
    label: "Active Emergency", 
    variant: "destructive",
    pulse: true
  },
  responding: { 
    label: "Response In Progress", 
    variant: "secondary",
    pulse: false
  },
  resolved: { 
    label: "Resolved", 
    variant: "outline",
    pulse: false
  },
  pending: { 
    label: "Pending Response", 
    variant: "destructive",
    pulse: true
  }
} as const

export function IncidentStatusCard({ 
  incident, 
  onRespond, 
  onViewDetails,
  className 
}: IncidentStatusCardProps) {
  const severityStyle = severityConfig[incident.severity]
  const statusStyle = statusConfig[incident.status]
  const SeverityIcon = severityStyle.icon

  const timeElapsed = React.useMemo(() => {
    const now = new Date()
    const diffMs = now.getTime() - incident.reportedAt.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else {
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours}h ${diffMins % 60}m ago`
    }
  }, [incident.reportedAt])

  return (
    <Card className={cn(
      "relative transition-all duration-200 hover:shadow-md",
      severityStyle.bgClass,
      statusStyle.pulse && "animate-pulse",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SeverityIcon className={cn(
              "h-5 w-5 flex-shrink-0",
              incident.severity === 'critical' && "text-destructive",
              incident.severity === 'high' && "text-orange-500",
              incident.severity === 'medium' && "text-yellow-500",
              incident.severity === 'low' && "text-blue-500"
            )} />
            <CardTitle className="text-base font-semibold truncate">
              {incident.title}
            </CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge variant={statusStyle.variant as any} className="text-xs">
              {statusStyle.label}
            </Badge>
            <Badge variant={severityStyle.badge as any} className="text-xs">
              {incident.severity.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {incident.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{incident.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{timeElapsed}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{incident.estimatedPersonsAffected} affected</span>
          </div>
          <div className="flex items-center gap-1">
            <Radio className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{incident.contactMethod}</span>
          </div>
        </div>

        {incident.assignedTeams.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Teams:</span>
            <div className="flex flex-wrap gap-1">
              {incident.assignedTeams.map((team, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                  {team}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {onRespond && incident.status === 'pending' && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onRespond(incident.id)}
            >
              Respond Now
            </Button>
          )}
          {onViewDetails && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewDetails(incident.id)}
            >
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}