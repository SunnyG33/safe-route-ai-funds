// Core Emergency Response Data Models
// These TypeScript interfaces will transfer directly to Next.js

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type IncidentStatus = 'active' | 'responding' | 'resolved' | 'pending' | 'escalated'
export type IncidentType = 
  | 'fire'
  | 'medical'
  | 'search_rescue'
  | 'natural_disaster'
  | 'technical_failure'
  | 'security'
  | 'evacuation'
  | 'communication_down'
  | 'supply_shortage'
  | 'weather_emergency'

export type PersonnelRole = 
  | 'incident_commander'
  | 'team_leader'
  | 'first_responder'
  | 'medical_officer'
  | 'communications_officer'
  | 'elder'
  | 'community_liaison'
  | 'logistics_coordinator'

export type CommunicationMethod = 
  | 'starlink'
  | 'satellite_phone'
  | 'radio'
  | 'cellular'
  | 'mesh_network'
  | 'emergency_beacon'

export type ResourceType = 
  | 'medical_supplies'
  | 'food_water'
  | 'shelter_materials'
  | 'communication_equipment'
  | 'transportation'
  | 'power_generation'
  | 'personnel'

// Core Incident Model
export interface Incident {
  id: string
  title: string
  description: string
  type: IncidentType
  priority: Priority
  status: IncidentStatus
  
  // Location & Time
  location: {
    coordinates?: { lat: number; lng: number }
    address: string
    area: string
    landmarks: string[]
  }
  reportedAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
  
  // Impact Assessment
  estimatedPersonsAffected: number
  actualPersonsAffected?: number
  evacuationRequired: boolean
  evacuationRadius?: number // in meters
  
  // Response Team
  assignedTeams: string[]
  incidentCommander?: string
  assignedPersonnel: PersonnelAssignment[]
  
  // Communication
  primaryContactMethod: CommunicationMethod
  backupContactMethods: CommunicationMethod[]
  communicationLog: CommunicationEntry[]
  
  // Resources
  requiredResources: ResourceRequirement[]
  allocatedResources: ResourceAllocation[]
  
  // Progress Tracking
  actionItems: ActionItem[]
  timeline: TimelineEntry[]
  
  // Metadata
  reportedBy: string
  tags: string[]
  attachments: Attachment[]
  lastUpdated: Date
  updatedBy: string
}

// Personnel Management
export interface Personnel {
  id: string
  name: string
  role: PersonnelRole
  specializations: string[]
  contactInfo: {
    phone: string
    email: string
    radio: string
    emergencyContact: string
  }
  location: {
    current?: { lat: number; lng: number }
    base: string
    lastUpdate: Date
  }
  availability: {
    status: 'available' | 'on_duty' | 'unavailable' | 'emergency_only'
    shiftStart?: Date
    shiftEnd?: Date
    notes?: string
  }
  certifications: Certification[]
  languages: string[]
  elderCouncilMember?: boolean
  traditionalKnowledge?: string[]
}

export interface PersonnelAssignment {
  personnelId: string
  role: string
  assignedAt: Date
  estimatedDuration?: number // in hours
  status: 'assigned' | 'en_route' | 'on_scene' | 'completed'
  notes?: string
}

// Communication Protocols
export interface CommunicationEntry {
  id: string
  timestamp: Date
  from: string
  to: string[]
  method: CommunicationMethod
  message: string
  priority: Priority
  acknowledged: boolean
  acknowledgedBy?: string[]
  acknowledgedAt?: Date
  attachments?: Attachment[]
}

export interface EmergencyProtocol {
  id: string
  name: string
  type: IncidentType
  priority: Priority
  description: string
  
  steps: ProtocolStep[]
  requiredRoles: PersonnelRole[]
  estimatedDuration: number // in minutes
  
  // Cultural Integration
  culturalConsiderations: string[]
  elderConsultationRequired: boolean
  traditionalPractices?: string[]
  
  // Communication Plan
  communicationTree: CommunicationNode[]
  notificationGroups: string[]
  
  lastUpdated: Date
  version: string
  approvedBy: string[]
}

export interface ProtocolStep {
  id: string
  order: number
  title: string
  description: string
  assignedRole?: PersonnelRole
  estimatedTime: number // in minutes
  required: boolean
  dependencies: string[] // step IDs
  resources?: ResourceRequirement[]
  checklistItems: ChecklistItem[]
}

// Resource Management
export interface ResourceRequirement {
  type: ResourceType
  description: string
  quantity: number
  unit: string
  priority: Priority
  requiredBy?: Date
  notes?: string
}

export interface ResourceAllocation {
  id: string
  resourceType: ResourceType
  description: string
  quantity: number
  unit: string
  allocatedAt: Date
  allocatedBy: string
  location: string
  status: 'allocated' | 'in_transit' | 'deployed' | 'consumed' | 'returned'
  estimatedArrival?: Date
  actualArrival?: Date
}

// Traditional Knowledge Integration
export interface TraditionalKnowledge {
  id: string
  title: string
  category: 'emergency_response' | 'weather_prediction' | 'resource_management' | 'communication' | 'cultural_protocol'
  description: string
  applicableIncidentTypes: IncidentType[]
  sharedBy: string // Elder or community member
  verifiedBy: string[]
  region: string
  season?: string
  conditions?: string[]
  steps: string[]
  modernEquivalent?: string
  integrationNotes?: string
  lastUpdated: Date
}

export interface ElderConsultation {
  id: string
  incidentId: string
  elderId: string
  consultationType: 'traditional_knowledge' | 'cultural_guidance' | 'decision_making' | 'conflict_resolution'
  requestedAt: Date
  consultedAt?: Date
  duration?: number // in minutes
  findings: string
  recommendations: string[]
  followUpRequired: boolean
  culturalSensitivities: string[]
  status: 'requested' | 'in_progress' | 'completed' | 'declined'
}

// System Models
export interface ActionItem {
  id: string
  title: string
  description: string
  assignedTo: string
  priority: Priority
  dueDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  dependencies: string[]
  createdAt: Date
  completedAt?: Date
  notes?: string
}

export interface TimelineEntry {
  id: string
  timestamp: Date
  event: string
  type: 'incident_update' | 'personnel_assignment' | 'resource_allocation' | 'communication' | 'protocol_step'
  details: string
  performedBy: string
  significance: 'low' | 'medium' | 'high' | 'critical'
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  completedBy?: string
  completedAt?: Date
  required: boolean
  notes?: string
}

export interface Certification {
  type: string
  issuedBy: string
  issuedAt: Date
  expiresAt?: Date
  certificationNumber: string
  status: 'active' | 'expired' | 'suspended'
}

export interface Attachment {
  id: string
  filename: string
  type: 'image' | 'document' | 'audio' | 'video'
  url: string
  uploadedBy: string
  uploadedAt: Date
  size: number
  description?: string
}

export interface CommunicationNode {
  role: PersonnelRole
  notificationOrder: number
  requiredResponse: boolean
  escalationTimeMinutes?: number
  backupContacts: string[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

// Form Types for UI
export interface CreateIncidentRequest {
  title: string
  description: string
  type: IncidentType
  priority: Priority
  location: {
    address: string
    coordinates?: { lat: number; lng: number }
  }
  estimatedPersonsAffected: number
  evacuationRequired: boolean
  reportedBy: string
  tags?: string[]
}

export interface UpdateIncidentRequest {
  status?: IncidentStatus
  description?: string
  estimatedPersonsAffected?: number
  assignedTeams?: string[]
  notes?: string
}

// Real-time Updates
export interface RealtimeUpdate {
  type: 'incident_created' | 'incident_updated' | 'personnel_assigned' | 'communication_received' | 'resource_allocated'
  timestamp: Date
  data: any
  affectedIncidents: string[]
  priority: Priority
}