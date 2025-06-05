import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Video, Mic, PhoneOff, ScreenShare, MessageSquare, Users, MoreVertical, UserCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const MeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingDetails, setMeetingDetails] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to join a meeting.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Simulate fetching meeting details and setting up WebRTC
    const setupMeeting = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      // Mock meeting details
      const mockMeeting = {
        id: meetingId,
        title: `Consultation with ${user.role === 'lawyer' ? 'Client X' : 'Lawyer Y'}`,
        participants: [
          { id: user.id, name: user.name, role: user.role },
          { id: 'otherUser123', name: user.role === 'lawyer' ? 'John Client' : 'Sarah Lawyer', role: user.role === 'lawyer' ? 'client' : 'lawyer' }
        ],
        startTime: new Date().toISOString(),
      };
      setMeetingDetails(mockMeeting);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        // In a real WebRTC setup, you'd connect to peers and set remoteVideoRef.current.srcObject
      } catch (error) {
        console.error("Error accessing media devices.", error);
        toast({
          title: "Media Device Error",
          description: "Could not access camera or microphone. Please check permissions.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    setupMeeting();

    return () => {
      // Cleanup: stop media stream
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId, user, navigate, toast]);


  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);
  const toggleMic = () => setIsMicEnabled(!isMicEnabled);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const toggleParticipants = () => setIsParticipantsOpen(!isParticipantsOpen);

  const handleLeaveMeeting = () => {
    toast({
      title: "Meeting Ended",
      description: "You have left the consultation.",
    });
    navigate(user.role === 'lawyer' ? '/dashboard' : '/'); // Navigate based on role
  };
  
  if (isLoading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
          <h1 className="text-3xl font-semibold mb-2">Joining Meeting...</h1>
          <p className="text-slate-400">Please wait while we connect you to the consultation.</p>
        </motion.div>
      </div>
    );
  }

  if (!meetingDetails) {
     return (
      <div className="container flex flex-col items-center justify-center min-h-screen py-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl"
        >
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
          <h1 className="text-3xl font-semibold mb-3">Meeting Not Found</h1>
          <p className="text-slate-400 mb-6">The meeting ID <span className="font-semibold text-primary">{meetingId}</span> is invalid or the meeting has ended.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
            Go to Homepage
          </Button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <header className="p-4 bg-slate-800 shadow-md">
        <h1 className="text-xl font-semibold">{meetingDetails?.title || 'Legal Consultation'}</h1>
      </header>

      <main className="flex-1 flex p-4 gap-4 overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          <Card className="flex-1 bg-slate-800 border-slate-700 overflow-hidden relative">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteVideoRef.current?.srcObject && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/70">
                    <UserCircle size={64} className="text-slate-500 mb-2"/>
                    <p className="text-slate-400">Waiting for other participant...</p>
                </div>
            )}
             <div className="absolute top-2 right-2 p-2 bg-black/30 rounded">
                <p className="text-sm">{meetingDetails?.participants.find(p => p.id !== user.id)?.name || 'Remote User'}</p>
            </div>
          </Card>
          <Card className="h-1/4 bg-slate-800 border-slate-700 overflow-hidden relative">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            {!isVideoEnabled && (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90">
                    <UserCircle size={48} className="text-slate-400"/>
                 </div>
            )}
            <div className="absolute top-2 right-2 p-2 bg-black/30 rounded">
                <p className="text-sm">{user?.name} (You)</p>
            </div>
          </Card>
        </div>

        {/* Sidebar for Chat/Participants */}
        <AnimatePresence>
          {(isChatOpen || isParticipantsOpen) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700"
            >
              {isChatOpen && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Chat</h3>
                  <div className="h-full bg-slate-700 rounded p-2 text-sm">Chat messages will appear here...</div>
                </div>
              )}
              {isParticipantsOpen && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Participants ({meetingDetails?.participants.length})</h3>
                  <ul className="space-y-2 text-sm">
                    {meetingDetails?.participants.map(p => (
                      <li key={p.id} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <span>{p.name} {p.id === user.id ? '(You)' : ''}</span>
                        <Mic size={16} className={p.id === user.id && !isMicEnabled ? "text-red-500" : "text-green-500"}/>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Controls */}
      <footer className="p-4 bg-slate-800 shadow-md flex justify-center items-center space-x-4">
        <Button onClick={toggleMic} variant={isMicEnabled ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <Mic size={20} />
        </Button>
        <Button onClick={toggleVideo} variant={isVideoEnabled ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <Video size={20} />
        </Button>
        <Button onClick={toggleScreenShare} variant={isScreenSharing ? "default" : "secondary"} size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <ScreenShare size={20} />
        </Button>
        <Button onClick={handleLeaveMeeting} variant="destructive" size="icon" className="rounded-full w-16 h-12">
          <PhoneOff size={20} />
        </Button>
        <Button onClick={toggleChat} variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <MessageSquare size={20} />
        </Button>
        <Button onClick={toggleParticipants} variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <Users size={20} />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-slate-700 hover:bg-slate-600 border-slate-600">
          <MoreVertical size={20} />
        </Button>
      </footer>
    </div>
  );
};

export default MeetingPage;