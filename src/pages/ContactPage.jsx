import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form data submitted:', formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="container py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Get in Touch</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          We're here to help. Whether you have a question about our services, need assistance, or want to provide feedback, please don't hesitate to reach out.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card p-8 rounded-xl shadow-xl border"
        >
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Our Office</h3>
                <p className="text-muted-foreground">123 Legal Avenue, Suite 789<br />New York, NY 10001, USA</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Email Us</h3>
                <p className="text-muted-foreground">contact@xpertslaw.com</p>
                <p className="text-muted-foreground">support@xpertslaw.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Call Us</h3>
                <p className="text-muted-foreground">(555) 123-4567</p>
                <p className="text-muted-foreground">Mon - Fri, 9am - 5pm EST</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card p-8 rounded-xl shadow-xl border"
        >
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Regarding my case..." required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Your message here..." required className="mt-1 min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {!isSubmitting && <Send size={16} />}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;