import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Leaf, 
  MessageCircle, 
  Settings, 
  Crown,
  TreePine,
  Compass,
  Heart,
  Eye,
  Plus,
  BookOpen,
  Radio,
  Brain,
  Zap,
  Database,
  Wifi,
  Cloud,
  Upload,
  Download,
  FileText,
  Search,
  Filter
} from "lucide-react";

const LeadershipPortal = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Elder Leadership Portal</h1>
              <p className="text-muted-foreground">Guiding community safety through traditional wisdom</p>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Community Connected
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Community Members</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Protocols</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Alerts</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Safe Check-ins Today</p>
                  <p className="text-2xl font-bold">198</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="protocols">Cultural Protocols</TabsTrigger>
            <TabsTrigger value="knowledge">Traditional Knowledge</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="responses">Emergency Response</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Situations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Current Situations
                  </CardTitle>
                  <CardDescription>Real-time community awareness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-destructive pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Wildfire Risk - Northern Territory</h4>
                        <p className="text-sm text-muted-foreground">Traditional burn area monitoring needed</p>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">River Crossing Conditions</h4>
                        <p className="text-sm text-muted-foreground">Seasonal knowledge assessment required</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Community Gathering - Safety Brief</h4>
                        <p className="text-sm text-muted-foreground">Traditional protocols to be shared</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Elder Consultation Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Elder Consultation Requests
                  </CardTitle>
                  <CardDescription>Community members seeking guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Safe Route to Sacred Site</h4>
                      <Badge variant="outline">2 hours ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Family needs guidance for ceremony preparation during storm season
                    </p>
                    <Button size="sm" className="mr-2">Respond</Button>
                    <Button size="sm" variant="outline">Assign Elder</Button>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Traditional Medicine Collection</h4>
                      <Badge variant="outline">5 hours ago</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Youth asking about safe areas for medicine gathering after recent floods
                    </p>
                    <Button size="sm" className="mr-2">Respond</Button>
                    <Button size="sm" variant="outline">Assign Elder</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Activity Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Community Activity & Traditional Territories
                </CardTitle>
                <CardDescription>Real-time view of community members and traditional knowledge zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive map showing:</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Community member locations (privacy-controlled)</li>
                      <li>• Traditional territory boundaries</li>
                      <li>• Sacred sites and protocols</li>
                      <li>• Current hazard areas</li>
                      <li>• Safe gathering places</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Protocols Tab */}
          <TabsContent value="protocols" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Cultural Emergency Protocols</h2>
                <p className="text-muted-foreground">Manage traditional response procedures and cultural considerations</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Radio className="h-3 w-3" />
                  Starlink Connected
                </Badge>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Protocol
                </Button>
              </div>
            </div>

            {/* Starlink Status & Protocol Sync */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-blue-600" />
                  Starlink Protocol Distribution Network
                </CardTitle>
                <CardDescription>Real-time protocol synchronization across all connected communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Connected Communities</p>
                      <p className="text-sm text-muted-foreground">8 communities online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Protocol Sync</p>
                      <p className="text-sm text-muted-foreground">Last sync: 2 min ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Emergency Backup</p>
                      <p className="text-sm text-muted-foreground">Offline protocols cached</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Protocols */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Active Protocols
                    <Badge variant="outline">12 Active</Badge>
                  </CardTitle>
                  <CardDescription>Currently enabled community protocols with real-time status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Sacred Site Emergency Procedures</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Active</Badge>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Traditional protocols for emergencies near ceremonial grounds. Auto-activates when proximity sensors detect presence near sacred sites.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Last Updated:</span> 
                        <span className="font-medium ml-1">Elder Mary T. - 3 days ago</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Communities Using:</span>
                        <span className="font-medium ml-1">6 of 8</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit Protocol</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Share via Starlink</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Community-First Response</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Active</Badge>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Elder consultation required before external emergency services. Includes cultural sensitivity protocols for first responders.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Response Time:</span> 
                        <span className="font-medium ml-1">Avg 4.2 min</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Success Rate:</span>
                        <span className="font-medium ml-1">94%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit Protocol</Button>
                      <Button size="sm" variant="outline">View Analytics</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Traditional Communication Chains</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Active</Badge>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Cultural hierarchy for emergency information sharing. Integrates Starlink backup communication when traditional methods fail.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Chain Length:</span> 
                        <span className="font-medium ml-1">5 levels</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Backup Mode:</span>
                        <span className="font-medium ml-1">Starlink Ready</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit Chain</Button>
                      <Button size="sm" variant="outline">Test Communication</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Starlink Emergency Bypass</h4>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">Standby</Badge>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automated protocol that activates Starlink direct-to-emergency-services when all local communication fails. Respects cultural protocols while ensuring safety.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Trigger Conditions:</span> 
                        <span className="font-medium ml-1">3 failures</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Elder Override:</span>
                        <span className="font-medium ml-1">Available</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Configure</Button>
                      <Button size="sm" variant="outline">Test Failover</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Protocol Templates & Creation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Protocol Templates & Builder
                    <Badge variant="outline">24 Templates</Badge>
                  </CardTitle>
                  <CardDescription>Pre-built cultural protocol frameworks and custom protocol creation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Categories */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button variant="outline" size="sm" className="text-xs">Ceremonial (8)</Button>
                    <Button variant="outline" size="sm" className="text-xs">Land-Based (6)</Button>
                    <Button variant="outline" size="sm" className="text-xs">Community (5)</Button>
                    <Button variant="outline" size="sm" className="text-xs">Emergency (5)</Button>
                  </div>

                  <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Radio className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Seasonal Ceremony Safety</h4>
                      <Badge variant="secondary" className="text-xs">Starlink Enhanced</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Framework for managing emergencies during traditional ceremonies. Now includes real-time weather monitoring via Starlink.
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">Weather Alerts</Badge>
                      <Badge variant="outline" className="text-xs">Elder Notification</Badge>
                      <Badge variant="outline" className="text-xs">Site Protection</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Activate Template</Button>
                      <Button size="sm" variant="outline">Customize</Button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Land-Based Learning Safety</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Protocols for educational activities on traditional territory. Includes GPS tracking and emergency beacons.
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">GPS Tracking</Badge>
                      <Badge variant="outline" className="text-xs">Group Management</Badge>
                      <Badge variant="outline" className="text-xs">Traditional Routes</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Activate Template</Button>
                      <Button size="sm" variant="outline">Preview</Button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Cultural Site Protection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Emergency procedures for protecting sacred and cultural sites during natural disasters or threats.
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className="text-xs">Site Monitoring</Badge>
                      <Badge variant="outline" className="text-xs">Access Control</Badge>
                      <Badge variant="outline" className="text-xs">Rapid Response</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Activate Template</Button>
                      <Button size="sm" variant="outline">Edit Template</Button>
                    </div>
                  </div>

                  {/* Custom Protocol Builder */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Custom Protocol Builder
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Create new protocols tailored to your community's specific needs and traditions.
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 border rounded text-xs">
                        <div className="font-medium">1. Define</div>
                        <div className="text-muted-foreground">Situation</div>
                      </div>
                      <div className="text-center p-2 border rounded text-xs">
                        <div className="font-medium">2. Set</div>
                        <div className="text-muted-foreground">Steps</div>
                      </div>
                      <div className="text-center p-2 border rounded text-xs">
                        <div className="font-medium">3. Test</div>
                        <div className="text-muted-foreground">Protocol</div>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">Start Protocol Builder</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Protocol Analytics & Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Protocol Performance & Analytics
                </CardTitle>
                <CardDescription>Real-time effectiveness monitoring and community feedback via Starlink network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-muted-foreground">Protocol Success Rate</div>
                    <div className="text-xs text-muted-foreground mt-1">↑ 12% this month</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2min</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    <div className="text-xs text-muted-foreground mt-1">↓ 30s improvement</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">847</div>
                    <div className="text-sm text-muted-foreground">Protocols Activated</div>
                    <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">8/8</div>
                    <div className="text-sm text-muted-foreground">Communities Connected</div>
                    <div className="text-xs text-muted-foreground mt-1">100% Starlink uptime</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">View Detailed Analytics</Button>
                  <Button variant="outline" size="sm">Export Protocol Report</Button>
                  <Button variant="outline" size="sm">Schedule Elder Review</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traditional Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Traditional Ecological Knowledge</h2>
                <p className="text-muted-foreground">Manage and integrate ancestral wisdom for emergency preparedness</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Brain className="h-3 w-3" />
                  AI Enhanced
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Cloud className="h-3 w-3" />
                  Starlink Synced
                </Badge>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Knowledge Entry
                </Button>
              </div>
            </div>

            {/* Starlink Knowledge Network */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-emerald-600" />
                  Traditional Knowledge Network via Starlink
                </CardTitle>
                <CardDescription>Real-time sharing and preservation of traditional knowledge across connected communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">Knowledge Entries</p>
                      <p className="text-sm text-muted-foreground">2,847 entries shared</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">AI Integration</p>
                      <p className="text-sm text-muted-foreground">89% knowledge mapped</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Elder Contributions</p>
                      <p className="text-sm text-muted-foreground">42 active elders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Last Backup</p>
                      <p className="text-sm text-muted-foreground">3 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Categories with Enhanced Features */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <TreePine className="h-5 w-5 text-emerald-600" />
                      Weather & Seasonal Knowledge
                    </div>
                    <Badge variant="outline" className="text-xs">234 entries</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-emerald-600" />
                    AI-Enhanced Predictions Active
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Storm Season Indicators</h4>
                      <Badge variant="secondary" className="text-xs">AI Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Traditional signs from nature</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">94% Accuracy</Badge>
                      <Badge variant="outline" className="text-xs">3 Elders</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Safe Shelter Locations</h4>
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Ancestral knowledge of refuge spots</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">67 Sites</Badge>
                      <Badge variant="outline" className="text-xs">GPS Mapped</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Water Source Safety</h4>
                      <Badge variant="outline" className="text-xs">Pending AI</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Seasonal water quality wisdom</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">45 Sources</Badge>
                      <Badge variant="outline" className="text-xs">Elder Review</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Search className="h-3 w-3 mr-1" />
                      Browse All
                    </Button>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      Land & Territory Knowledge
                    </div>
                    <Badge variant="outline" className="text-xs">189 entries</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Database className="h-3 w-3 text-green-600" />
                    GPS Coordinates Integrated
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Safe Passage Routes</h4>
                      <Badge variant="secondary" className="text-xs">AI Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Traditional travel corridors</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">23 Routes</Badge>
                      <Badge variant="outline" className="text-xs">Live Tracking</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Hazardous Terrain</h4>
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Areas to avoid in emergencies</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">Alert Zones</Badge>
                      <Badge variant="outline" className="text-xs">Auto-Update</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Resource Locations</h4>
                      <Badge variant="secondary" className="text-xs">Mapped</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Emergency food and medicine sources</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">156 Sites</Badge>
                      <Badge variant="outline" className="text-xs">Seasonal</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Search className="h-3 w-3 mr-1" />
                      Browse All
                    </Button>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                      Cultural Practices
                    </div>
                    <Badge variant="outline" className="text-xs">127 entries</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-purple-600" />
                    Multimedia Archives Available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Emergency Ceremonies</h4>
                      <Badge variant="secondary" className="text-xs">Protected</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Traditional healing and protection</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">Audio/Video</Badge>
                      <Badge variant="outline" className="text-xs">Restricted</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Community Gathering Protocols</h4>
                      <Badge variant="secondary" className="text-xs">AI Ready</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Cultural emergency assembly</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">12 Protocols</Badge>
                      <Badge variant="outline" className="text-xs">Elder Notes</Badge>
                    </div>
                  </div>

                  <div className="p-3 border rounded bg-background hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">Storytelling for Safety</h4>
                      <Badge variant="outline" className="text-xs">In Progress</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Teaching through narrative</p>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">34 Stories</Badge>
                      <Badge variant="outline" className="text-xs">Multimedia</Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Search className="h-3 w-3 mr-1" />
                      Browse All
                    </Button>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Integration Dashboard */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  AI Knowledge Integration Dashboard
                </CardTitle>
                <CardDescription>Real-time status of traditional knowledge integration with AI systems via Starlink</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Integration Status */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Knowledge Integration Status</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-sm">Route Planning</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">98% Integrated</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Traditional safe routes and seasonal considerations active in AI recommendations
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="font-medium text-sm">Weather Predictions</span>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">67% Integrated</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Traditional weather indicators being merged with satellite data
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-sm">Cultural Protocols</span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">100% Integrated</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI fully respects cultural boundaries and sacred site restrictions
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-lg bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-sm">Emergency Resources</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">45% Integrated</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Traditional resource knowledge being mapped for AI integration
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium">AI Performance with Traditional Knowledge</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <div className="text-2xl font-bold text-emerald-600">92%</div>
                        <div className="text-xs text-muted-foreground">Accuracy Improvement</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <div className="text-2xl font-bold text-blue-600">34%</div>
                        <div className="text-xs text-muted-foreground">Response Time Reduction</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <div className="text-2xl font-bold text-purple-600">2,847</div>
                        <div className="text-xs text-muted-foreground">Knowledge Entries Active</div>
                      </div>
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <div className="text-2xl font-bold text-orange-600">99.8%</div>
                        <div className="text-xs text-muted-foreground">Cultural Compliance</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-background">
                        <h5 className="font-medium text-sm mb-2">Recent AI Learnings</h5>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                            <span>Seasonal bird migration patterns now predict weather changes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span>Traditional plant indicators enhance flood prediction accuracy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            <span>Elder route preferences improve safety recommendations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Export Knowledge Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3 w-3 mr-1" />
                    Bulk Upload Knowledge
                  </Button>
                  <Button variant="outline" size="sm">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Training Status
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-3 w-3 mr-1" />
                    Knowledge Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Contribution System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Knowledge Contributions
                </CardTitle>
                <CardDescription>Elder submissions and community knowledge sharing via Starlink network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Recent Elder Contributions</h4>
                    <Button size="sm" variant="outline">View All Submissions</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Elder Mary Thompson</h5>
                        <Badge variant="secondary" className="text-xs">2 hours ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Traditional burn indicators for Northern Territory - when the honey myrtles start showing new growth pattern..."
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Weather Knowledge</Badge>
                        <Badge variant="outline" className="text-xs">AI Pending</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">Review & Integrate</Button>
                        <Button size="sm" variant="outline">Audio Recording</Button>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">Elder Robert Clearwater</h5>
                        <Badge variant="secondary" className="text-xs">5 hours ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        "Emergency water source near Sunset Ridge - underground spring location accessible during dry season..."
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Resource Location</Badge>
                        <Badge variant="outline" className="text-xs">GPS Added</Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm">Review & Integrate</Button>
                        <Button size="sm" variant="outline">View Location</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placeholder for other tabs */}
          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Community Management</CardTitle>
                <CardDescription>Coming soon - Member management and communication tools</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Response Coordination</CardTitle>
                <CardDescription>Coming soon - Real-time emergency response management</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Portal Settings</CardTitle>
                <CardDescription>Coming soon - Configure portal preferences and permissions</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeadershipPortal;