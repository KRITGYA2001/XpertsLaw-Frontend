
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, FileText, MessageSquare, User, Settings } from "lucide-react";

const LawyerDashboard = ({ user }) => {
  // In a real app, you would fetch this data from your backend
  const upcomingConsultations = [
    {
      id: "cons-1",
      clientName: "John Doe",
      date: "June 5, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      status: "confirmed",
      meetingLink: "https://xpertslaw.com/meeting/BK12345",
      caseType: "Divorce",
    },
    {
      id: "cons-2",
      clientName: "Jane Smith",
      date: "June 10, 2025",
      time: "2:00 PM",
      duration: "60 minutes",
      status: "pending",
      meetingLink: "",
      caseType: "Child Custody",
    },
  ];

  const pastConsultations = [
    {
      id: "cons-3",
      clientName: "Robert Johnson",
      date: "May 20, 2025",
      time: "11:00 AM",
      duration: "60 minutes",
      status: "completed",
      meetingLink: "",
      caseType: "Prenuptial Agreement",
    },
  ];

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your consultations, clients, and schedule (lawyer)
          </p>
        </div>
        {/* <Link to="/profile/settings">
          <Button variant="outline" className="gap-2">
            <Settings size={16} />
            Profile Settings
          </Button>
        </Link> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Consultations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-muted-foreground">Current clients</p>
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

      <Tabs defaultValue="consultations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
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
                <div>
                  <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
                  {upcomingConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingConsultations.map((consultation) => (
                        <div key={consultation.id} className="meeting-card bg-background rounded-lg border p-4 flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              <span className="font-medium">{consultation.clientName}</span>
                              <span className="text-sm text-muted-foreground">({consultation.caseType})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{consultation.time} ({consultation.duration})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${
                                consultation.status === 'confirmed' ? 'bg-green-500' : 
                                consultation.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="capitalize">{consultation.status}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end justify-center">
                            {consultation.status === 'confirmed' && (
                              <a 
                                href={consultation.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full md:w-auto"
                              >
                                <Button className="w-full md:w-auto gap-2">
                                  <Video size={16} />
                                  Start Meeting
                                </Button>
                              </a>
                            )}
                            {consultation.status === 'pending' && (
                              <Button className="w-full md:w-auto">
                                Confirm
                              </Button>
                            )}
                            <Link to={`/consultations/${consultation.id}`} className="w-full md:w-auto">
                              <Button variant="outline" className="w-full md:w-auto">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No upcoming consultations.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Past</h3>
                  {pastConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {pastConsultations.map((consultation) => (
                        <div key={consultation.id} className="bg-muted/30 rounded-lg border p-4 flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              <span className="font-medium">{consultation.clientName}</span>
                              <span className="text-sm text-muted-foreground">({consultation.caseType})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{consultation.time} ({consultation.duration})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <span>Completed</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end justify-center">
                            <Button variant="outline" className="w-full md:w-auto">
                              Add Notes
                            </Button>
                            <Link to={`/consultations/${consultation.id}`} className="w-full md:w-auto">
                              <Button variant="outline" className="w-full md:w-auto">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No past consultations.</p>
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
                <p className="text-muted-foreground">No documents available.</p>
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
                <p className="text-muted-foreground">No messages available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LawyerDashboard;
