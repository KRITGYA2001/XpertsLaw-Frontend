import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Video, FileText, MessageSquare, User, Settings, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const LawyerDashboard = ({ user }) => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingBooking, setConfirmingBooking] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for documents and messages (would be replaced with API calls)
  const documents = [
    {
      id: "doc-1",
      name: "Divorce Agreement Draft",
      clientName: "John Doe",
      date: "May 28, 2025",
      size: "1.2 MB",
      type: "PDF",
    },
    {
      id: "doc-2",
      name: "Child Custody Documents",
      clientName: "Jane Smith",
      date: "May 25, 2025",
      size: "3.5 MB",
      type: "PDF",
    },
  ];

  const messages = [
    {
      id: "msg-1",
      from: "John Doe",
      subject: "Question about our consultation",
      preview: "I had a follow-up question about...",
      date: "May 29, 2025",
      unread: true,
    },
    {
      id: "msg-2",
      from: "Jane Smith",
      subject: "Documents for review",
      preview: "I've attached the documents you requested...",
      date: "May 27, 2025",
      unread: false,
    },
  ];

  useEffect(() => {
    fetchLawyerConsultations();
  }, [user]);

  const fetchLawyerConsultations = async (showRefreshingIndicator = false) => {
    if (showRefreshingIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Try to fetch consultations for this lawyer from API
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };

      // GET List Lawyer Consultation - filtered by lawyer
      const response = await fetch(`${API_BASE}/lawyers/consultations/?lawyer_id=${user.id}`, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Lawyer API Response:', result);
        
        // Handle different possible response structures
        const consultationsData = result?.data?.data || result?.data || result?.results || result || [];
        
        // Transform API data to match component expectations
        const transformedConsultations = consultationsData.map(consultation => {
          const consultationDate = new Date(consultation.consultation_date || consultation.date);
          const today = new Date();
          const isPast = consultationDate < today;

          return {
            id: consultation.id,
            clientName: consultation.client ? 
              `${consultation.client.user?.first_name || ''} ${consultation.client.user?.last_name || ''}`.trim() || 
              consultation.client.name || 
              "Client" : consultation.client_name || "Client",
            clientEmail: consultation.client?.user?.email || consultation.client?.email || consultation.client_email || "",
            clientPhone: consultation.client?.phone || consultation.client_phone || "",
            date: consultationDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            time: consultation.consultation_time || consultation.time || "10:00 AM",
            duration: `${consultation.duration || 60} minutes`,
            status: consultation.status || 'pending',
            meetingLink: consultation.meeting_link || `/meeting/${consultation.id}`,
            caseType: consultation.case_type || consultation.legal_matter_type || "General Consultation",
            caseDescription: consultation.case_description || consultation.description || "",
            fee: consultation.consultation_fee ? `₹${consultation.consultation_fee}` : "₹2000",
            rawDate: consultation.consultation_date || consultation.date,
            isPast: isPast,
            createdAt: consultation.created_at,
            updatedAt: consultation.updated_at
          };
        });

        // Sort by date (newest first)
        transformedConsultations.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
        setConsultations(transformedConsultations);
        
        if (showRefreshingIndicator) {
          toast({
            title: "Refreshed",
            description: "Your consultations have been updated.",
          });
        }
      } else if (response.status === 404) {
        // No consultations found
        setConsultations([]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching lawyer consultations:', err);
      setError(err.message);
      
      // Fallback to mock data for development
      console.log('Falling back to mock consultation data');
      generateMockConsultations();
      
      if (showRefreshingIndicator) {
        toast({
          title: "Error Refreshing",
          description: "Failed to refresh consultations. Showing mock data.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateMockConsultations = () => {
    // Generate mock consultations for the lawyer
    const mockConsultations = [
      {
        id: "cons-1",
        clientName: "Ananya Sharma",
        clientEmail: "ananya.sharma@email.com",
        clientPhone: "9876543210",
        date: "June 15, 2025",
        time: "10:00 AM",
        duration: "60 minutes",
        status: "pending",
        meetingLink: "/meeting/cons-1",
        caseType: "Property Dispute",
        caseDescription: "Need legal advice regarding property inheritance dispute with siblings.",
        fee: "₹3000",
        rawDate: "2025-06-15"
      },
      {
        id: "cons-2",
        clientName: "Rajesh Kumar",
        clientEmail: "rajesh.kumar@email.com",
        clientPhone: "9876543211",
        date: "June 12, 2025",
        time: "2:00 PM",
        duration: "60 minutes",
        status: "confirmed",
        meetingLink: "/meeting/cons-2",
        caseType: "Corporate Law",
        caseDescription: "Startup legal structure and compliance requirements.",
        fee: "₹4000",
        rawDate: "2025-06-12"
      },
      {
        id: "cons-3",
        clientName: "Priya Reddy",
        clientEmail: "priya.reddy@email.com",
        clientPhone: "9876543212",
        date: "June 10, 2025",
        time: "11:00 AM",
        duration: "90 minutes",
        status: "pending",
        meetingLink: "/meeting/cons-3",
        caseType: "Family Law",
        caseDescription: "Divorce proceedings and child custody arrangements.",
        fee: "₹5000",
        rawDate: "2025-06-10"
      },
      {
        id: "cons-4",
        clientName: "Mohammed Ali",
        clientEmail: "mohammed.ali@email.com",
        clientPhone: "9876543213",
        date: "May 28, 2025",
        time: "3:00 PM",
        duration: "60 minutes",
        status: "completed",
        meetingLink: "/meeting/cons-4",
        caseType: "Contract Law",
        caseDescription: "Review of employment contract and terms negotiation.",
        fee: "₹2500",
        rawDate: "2025-05-28"
      },
      {
        id: "cons-5",
        clientName: "Deepika Singh",
        clientEmail: "deepika.singh@email.com",
        clientPhone: "9876543214",
        date: "May 25, 2025",
        time: "4:00 PM",
        duration: "60 minutes",
        status: "completed",
        meetingLink: "/meeting/cons-5",
        caseType: "Intellectual Property",
        caseDescription: "Trademark registration for new business.",
        fee: "₹3500",
        rawDate: "2025-05-25"
      }
    ];

    // Sort by date (newest first)
    mockConsultations.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    setConsultations(mockConsultations);
  };

  const handleConfirmBooking = async (consultationId) => {
    setConfirmingBooking(consultationId);
    
    try {
      // Use your PUT Update Lawyer Consultation API
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_BASE}/lawyers/consultations/${consultationId}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'confirmed'
        })
      });

      if (response.ok) {
        // Update the consultation status locally
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === consultationId 
              ? { ...consultation, status: 'confirmed' }
              : consultation
          )
        );
        
        toast({
          title: "Booking Confirmed",
          description: "The consultation has been confirmed successfully.",
        });
      } else {
        throw new Error('Failed to confirm booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast({
        title: "Error",
        description: "Failed to confirm booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirmingBooking(null);
    }
  };

  const handleRejectBooking = async (consultationId) => {
    try {
      // Use your PUT Update Lawyer Consultation API
      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_BASE}/lawyers/consultations/${consultationId}/`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: 'cancelled'
        })
      });

      if (response.ok) {
        // Update the consultation status locally
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === consultationId 
              ? { ...consultation, status: 'cancelled' }
              : consultation
          )
        );
        
        toast({
          title: "Booking Rejected",
          description: "The consultation has been rejected.",
        });
      } else {
        throw new Error('Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: "Error",
        description: "Failed to reject booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchLawyerConsultations(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
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
    switch (status) {
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

  const upcomingConsultations = consultations.filter(c => 
    c.status !== 'completed' && c.status !== 'cancelled'
  );
  const pastConsultations = consultations.filter(c => 
    c.status === 'completed' || c.status === 'cancelled'
  );
  const pendingConsultations = consultations.filter(c => c.status === 'pending');
  const todayConsultations = consultations.filter(c => {
    const today = new Date().toISOString().split('T')[0];
    return c.rawDate === today && (c.status === 'confirmed' || c.status === 'pending');
  });

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
          <h1 className="text-3xl font-bold">Welcome back, Dr. {user.name}!</h1>
          <p className="text-muted-foreground">
            Manage your consultations, clients, and schedule
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Link to="/profile">
            <Button variant="outline" className="gap-2">
              <Settings size={16} />
              Manage Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && !consultations.length && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <p className="font-medium">Failed to load consultations</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="mt-3"
              size="sm"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayConsultations.length}</p>
            <p className="text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Pending Confirmations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingConsultations.length}</p>
            <p className="text-muted-foreground">Awaiting your response</p>
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Consultations</CardTitle>
                  <CardDescription>
                    View and manage consultations booked by your clients
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="gap-2"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upcoming Consultations */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming & Pending ({upcomingConsultations.length})
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
                                    <span className="font-semibold text-lg">{consultation.clientName}</span>
                                    <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-full">
                                      {consultation.caseType}
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
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(consultation.status)}
                                  <span className="capitalize font-medium">{consultation.status}</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Email:</span>
                                  <span className="text-muted-foreground">{consultation.clientEmail}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Phone:</span>
                                  <span className="text-muted-foreground">{consultation.clientPhone}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Consultation Fee:</span>
                                <span className="text-green-600 font-semibold">{consultation.fee}</span>
                              </div>
                              
                              {consultation.caseDescription && (
                                <div className="text-sm">
                                  <span className="font-medium">Case Description:</span>
                                  <p className="text-muted-foreground mt-1 bg-muted/30 p-2 rounded">
                                    {consultation.caseDescription}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col gap-2 lg:w-48">
                              {consultation.status === 'pending' && (
                                <div className="flex flex-col gap-2">
                                  <Button 
                                    onClick={() => handleConfirmBooking(consultation.id)}
                                    disabled={confirmingBooking === consultation.id}
                                    className="w-full gap-2"
                                  >
                                    {confirmingBooking === consultation.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Confirming...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle size={16} />
                                        Confirm Booking
                                      </>
                                    )}
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => handleRejectBooking(consultation.id)}
                                    className="w-full gap-2"
                                  >
                                    <XCircle size={16} />
                                    Reject
                                  </Button>
                                </div>
                              )}
                              
                              {consultation.status === 'confirmed' && (
                                <Link to={consultation.meetingLink} className="w-full">
                                  <Button className="w-full gap-2">
                                    <Video size={16} />
                                    Start Meeting
                                  </Button>
                                </Link>
                              )}
                              
                              <Link to={`/consultations/${consultation.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                  View Details
                                </Button>
                              </Link>
                              
                              <Button variant="ghost" size="sm" className="w-full">
                                Contact Client
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/30 rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-lg">No upcoming consultations</p>
                      <p className="text-sm text-muted-foreground mb-4">New client bookings will appear here</p>
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
                                <span className="font-medium">{consultation.clientName}</span>
                                <span className="text-sm text-muted-foreground">({consultation.caseType})</span>
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
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${getStatusColor(consultation.status)}`} />
                                <span className="text-sm capitalize">{consultation.status}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:w-48">
                              <Button variant="outline" className="w-full">
                                Add Notes
                              </Button>
                              <Link to={`/consultations/${consultation.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                  View Details
                                </Button>
                              </Link>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Your Documents</CardTitle>
                <CardDescription>
                  Manage documents shared with your clients
                </CardDescription>
              </div>
              <Button className="mt-4 md:mt-0">Upload Document</Button>
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
                          <span>Shared with: {document.clientName}</span>
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
                        <Button variant="outline" className="w-full md:w-auto">
                          Share
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
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle>Your Messages</CardTitle>
                <CardDescription>
                  View and respond to messages from your clients
                </CardDescription>
              </div>
              <Button className="mt-4 md:mt-0">Compose Message</Button>
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
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
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

export default LawyerDashboard;