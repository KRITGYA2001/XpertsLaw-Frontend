import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Video, FileText, MessageSquare, User, Search, CheckCircle, XCircle, AlertCircle, Phone, Mail } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const ClientDashboard = ({ user }) => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for documents and messages (would be replaced with API calls)
  const documents = [
    {
      id: "doc-1",
      name: "Divorce Agreement Draft",
      uploadedBy: "Sarah Johnson",
      date: "May 28, 2025",
      size: "1.2 MB",
      type: "PDF",
    },
    {
      id: "doc-2",
      name: "Child Custody Documents",
      uploadedBy: "Sarah Johnson",
      date: "May 25, 2025",
      size: "3.5 MB",
      type: "PDF",
    },
  ];

  const messages = [
    {
      id: "msg-1",
      from: "Sarah Johnson",
      subject: "Follow-up on our consultation",
      preview: "I wanted to follow up on our discussion about...",
      date: "May 29, 2025",
      unread: true,
    },
    {
      id: "msg-2",
      from: "Michael Chen",
      subject: "Preparation for our meeting",
      preview: "Please bring the following documents to our...",
      date: "May 27, 2025",
      unread: false,
    },
  ];

  useEffect(() => {
    fetchClientConsultations();
  }, [user]);

  const fetchClientConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch consultations/bookings for this client from the API
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };

      console.log('Fetching consultations for user:', user.id);
      
      const response = await fetch(`${API_BASE}/consultation/consultations/`, {
        headers
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Raw API response:', result);
        
        // Handle nested data structure from API response
        let consultationsData = result?.data?.data || result?.data || result || [];
        
        // Ensure consultationsData is an array
        if (!Array.isArray(consultationsData)) {
          console.log('API response is not an array:', consultationsData);
          consultationsData = [];
        }
        
        console.log('All consultations from API:', consultationsData);
        
        // Filter consultations for current user and transform data
        const userConsultations = consultationsData
          .filter(consultation => {
            const consultationUserId = consultation.user?.id || consultation.user;
            const currentUserId = parseInt(user.id);
            console.log(`Comparing consultation user ${consultationUserId} with current user ${currentUserId}`);
            return consultationUserId === currentUserId;
          })
          .map(consultation => transformConsultationData(consultation));
        
        console.log('Filtered user consultations:', userConsultations);
        setConsultations(userConsultations);
      } else {
        throw new Error(`Failed to fetch consultations: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError(err.message);
      // For now, we'll show empty state when API fails
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const transformConsultationData = (apiData) => {
    console.log('Transforming consultation data:', apiData);
    
    // Transform API consultation data to match component expectations
    const consultationDate = new Date(apiData.date);
    const today = new Date();
    const isPast = consultationDate < today;

    // Handle time format - convert from 24-hour to 12-hour for display
    const formatTime = (timeStr) => {
      if (!timeStr) return "Time not specified";
      
      try {
        // If it's already in 12-hour format, return as is
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          return timeStr;
        }
        
        // Convert from 24-hour format (18:00:00) to 12-hour format (6:00 PM)
        const [hours, minutes] = timeStr.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; // 0 should be 12
        return `${hour}:${minutes} ${ampm}`;
      } catch (error) {
        console.error('Error formatting time:', timeStr, error);
        return timeStr; // fallback to original
      }
    };

    const transformed = {
      id: apiData.id,
      lawyerId: apiData.lawyer, // This is just an ID number from the API
      lawyerName: "Legal Expert", // Default since API doesn't include lawyer details
      lawyerSpecialty: "Legal Services", // Default since API doesn't include lawyer details
      lawyerEmail: "", // Not available in this API response
      lawyerPhone: "", // Not available in this API response
      date: consultationDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: formatTime(apiData.time),
      duration: "60 minutes", // Default duration since it's not in API response
      status: apiData.status || 'pending',
      meetingLink: `/meeting/${apiData.id}`,
      fee: "₹2000", // Default since lawyer details aren't included
      caseType: apiData.legal_matter?.name || "General Consultation",
      caseDescription: apiData.description || "",
      clientPhone: apiData.phone || "",
      rawDate: apiData.date,
      isPast: isPast,
      createdAt: apiData.created_at || apiData.date,
    };
    
    console.log('Transformed consultation:', transformed);
    return transformed;
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const upcomingConsultations = consultations.filter(c => !c.isPast);
  const pastConsultations = consultations.filter(c => c.isPast);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Manage your consultations, documents, and messages
          </p>
        </div>
        <Link to="/lawyers">
          <Button className="gap-2">
            <Search size={16} />
            Find a Lawyer
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{upcomingConsultations.length}</p>
            <p className="text-muted-foreground">Scheduled consultations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{documents.length}</p>
            <p className="text-muted-foreground">Shared documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{messages.filter(m => m.unread).length}</p>
            <p className="text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="consultations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultations">
            Consultations ({consultations.length})
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consultations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Consultations</CardTitle>
              <CardDescription>
                View and manage your upcoming and past consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upcoming Consultations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming ({upcomingConsultations.length})
                  </h3>
                  {upcomingConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingConsultations.map((consultation) => (
                        <div key={consultation.id} className="bg-background rounded-lg border p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-lg">{consultation.lawyerName}</span>
                                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                                      {consultation.lawyerSpecialty}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>{consultation.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{consultation.time} ({consultation.duration})</span>
                                    </div>
                                  </div>
                                  {consultation.lawyerEmail && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Mail className="h-4 w-4" />
                                      <span>{consultation.lawyerEmail}</span>
                                    </div>
                                  )}
                                  {consultation.lawyerPhone && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Phone className="h-4 w-4" />
                                      <span>{consultation.lawyerPhone}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(consultation.status)}
                                  <span className="capitalize font-medium">{consultation.status}</span>
                                </div>
                              </div>
                              
                              {consultation.caseType && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">Case Type:</span>
                                  <span className="text-muted-foreground">{consultation.caseType}</span>
                                </div>
                              )}
                              
                              {consultation.caseDescription && (
                                <div className="flex items-start gap-2 text-sm">
                                  <span className="font-medium">Description:</span>
                                  <span className="text-muted-foreground line-clamp-2">{consultation.caseDescription}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Consultation Fee:</span>
                                <span className="text-muted-foreground">{consultation.fee}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 lg:w-48">
                              {consultation.status.toLowerCase() === 'confirmed' && (
                                <Link to={consultation.meetingLink} className="w-full">
                                  <Button className="w-full gap-2">
                                    <Video size={16} />
                                    Join Meeting
                                  </Button>
                                </Link>
                              )}
                              {consultation.status.toLowerCase() === 'pending' && (
                                <Button disabled className="w-full gap-2">
                                  <AlertCircle size={16} />
                                  Awaiting Confirmation
                                </Button>
                              )}
                              <Link to={`/consultations/${consultation.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                  View Details
                                </Button>
                              </Link>
                              <Link to={`/lawyers/${consultation.lawyerId}`} className="w-full">
                                <Button variant="ghost" size="sm" className="w-full">
                                  Lawyer Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg">No upcoming consultations</p>
                      <p className="text-sm text-muted-foreground mb-4">Book a consultation with one of our expert lawyers</p>
                      <Link to="/lawyers">
                        <Button>Find a Lawyer</Button>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Past Consultations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Past Consultations ({pastConsultations.length})
                  </h3>
                  {pastConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {pastConsultations.map((consultation) => (
                        <div key={consultation.id} className="bg-muted/30 rounded-lg border p-4">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <span className="font-medium">{consultation.lawyerName}</span>
                                <span className="text-sm text-muted-foreground">({consultation.lawyerSpecialty})</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{consultation.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{consultation.time} ({consultation.duration})</span>
                                </div>
                              </div>
                              {consultation.caseType && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">Case Type:</span>
                                  <span className="text-muted-foreground">{consultation.caseType}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-sm capitalize">{consultation.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:w-48">
                              <Link to={`/consultations/${consultation.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                  View Details
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="w-full">
                                Download Summary
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">No past consultations yet</p>
                    </div>
                  )}
                </div>

                {/* Error State */}
                {error && (
                  <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                    <p className="text-red-800 font-medium">Error loading consultations</p>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <Button onClick={fetchClientConsultations} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                Access and manage documents shared by your lawyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.id} className="bg-background rounded-lg border p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">{document.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Shared by: {document.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{document.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{document.size} • {document.type}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end justify-center">
                        <Button variant="outline" className="w-full md:w-auto">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No documents available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Messages</CardTitle>
              <CardDescription>
                View and respond to messages from your lawyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`bg-background rounded-lg border p-4 ${message.unread ? 'border-primary/50' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="font-medium">{message.from}</span>
                          {message.unread && (
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{message.date}</span>
                      </div>
                      <h4 className="font-medium mb-1">{message.subject}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{message.preview}</p>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Read Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;