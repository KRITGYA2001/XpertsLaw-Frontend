import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="flex flex-col items-center"
      >
        <AlertTriangle className="w-24 h-24 text-primary mb-8" />
        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">Oops! Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Home size={18} />
            Go Back to Homepage
          </Button>
        </Link>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        XpertsLaw - Your Legal Connection
      </motion.div>
    </div>
  );
};

export default NotFoundPage;