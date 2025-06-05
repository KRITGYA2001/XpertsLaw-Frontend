
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import LawyerDashboard from "@/components/dashboard/LawyerDashboard";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container py-8 md:py-12">
      {user.role === "lawyer" ? (
        <LawyerDashboard user={user} />
      ) : (
        <ClientDashboard user={user} />
      )}
    </div>
  );
};

export default DashboardPage;
