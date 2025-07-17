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
  Radio
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
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Protocol
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Protocols</CardTitle>
                  <CardDescription>Currently enabled community protocols</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Sacred Site Emergency Procedures</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Traditional protocols for emergencies near ceremonial grounds
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Community-First Response</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Elder consultation before external emergency services
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Traditional Communication Chains</h4>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Cultural hierarchy for emergency information sharing
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protocol Templates</CardTitle>
                  <CardDescription>Pre-built cultural protocol frameworks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Seasonal Ceremony Safety</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Framework for managing emergencies during traditional ceremonies
                    </p>
                    <Button size="sm">Activate Template</Button>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Land-Based Learning Safety</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Protocols for educational activities on traditional territory
                    </p>
                    <Button size="sm">Activate Template</Button>
                  </div>

                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h4 className="font-medium mb-2">Cultural Site Protection</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Emergency procedures for protecting sacred and cultural sites
                    </p>
                    <Button size="sm">Activate Template</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Traditional Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Traditional Ecological Knowledge</h2>
                <p className="text-muted-foreground">Manage and integrate ancestral wisdom for emergency preparedness</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Knowledge Entry
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Weather & Seasonal Knowledge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Storm Season Indicators</h4>
                    <p className="text-xs text-muted-foreground">Traditional signs from nature</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Safe Shelter Locations</h4>
                    <p className="text-xs text-muted-foreground">Ancestral knowledge of refuge spots</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Water Source Safety</h4>
                    <p className="text-xs text-muted-foreground">Seasonal water quality wisdom</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">View All</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Land & Territory Knowledge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Safe Passage Routes</h4>
                    <p className="text-xs text-muted-foreground">Traditional travel corridors</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Hazardous Terrain</h4>
                    <p className="text-xs text-muted-foreground">Areas to avoid in emergencies</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Resource Locations</h4>
                    <p className="text-xs text-muted-foreground">Emergency food and medicine sources</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">View All</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Cultural Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Emergency Ceremonies</h4>
                    <p className="text-xs text-muted-foreground">Traditional healing and protection</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Community Gathering Protocols</h4>
                    <p className="text-xs text-muted-foreground">Cultural emergency assembly</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium text-sm">Storytelling for Safety</h4>
                    <p className="text-xs text-muted-foreground">Teaching through narrative</p>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">View All</Button>
                </CardContent>
              </Card>
            </div>

            {/* Knowledge Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>AI Integration Status</CardTitle>
                <CardDescription>How traditional knowledge is being used by the SafeRoute AI system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Route Planning</h4>
                      <Badge className="bg-green-100 text-green-800">Integrated</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Traditional safe routes and seasonal considerations are active in AI recommendations
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Weather Predictions</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Some traditional weather indicators integrated, more knowledge needed
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Cultural Protocols</h4>
                      <Badge className="bg-green-100 text-green-800">Integrated</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI respects cultural boundaries and sacred site restrictions
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Emergency Resources</h4>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Traditional resource knowledge being mapped for AI integration
                    </p>
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