import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Calendar, User } from "lucide-react";

const API_BASE = "http://xpertslaw-backend-env.eba-s2nkai2i.us-east-1.elasticbeanstalk.com";

const LawyerProfileView = ({ profile, user, onEdit, profileExists = false }) => {
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  // Fetch institutions if we have education data but no institution names
  useEffect(() => {
    const needsInstitutions = profile?.education?.some(edu => 
      typeof edu.institution === 'number' || 
      (typeof edu.institution === 'string' && !isNaN(edu.institution))
    );

    if (needsInstitutions && allInstitutions.length === 0 && user?.token) {
      fetchInstitutions();
    }
  }, [profile, allInstitutions, user]);

  const fetchInstitutions = async () => {
    setLoadingInstitutions(true);
    try {
      const response = await fetch(`${API_BASE}/lawyers/institutions/`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const institutionsData = result?.data?.data || result?.data || result || [];
        setAllInstitutions(institutionsData);
      }
    } catch (err) {
      console.error('Error fetching institutions:', err);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const formatValue = (val) => val || "N/A";

  const getInstitutionName = (institution) => {
    // If institution is already an object with name, return it
    if (typeof institution === 'object' && institution?.name) {
      return institution.name;
    }
    
    // If institution is an ID (number or string number), find the name
    const institutionId = typeof institution === 'number' ? institution : parseInt(institution);
    if (!isNaN(institutionId) && allInstitutions.length > 0) {
      const match = allInstitutions.find(inst => inst.id === institutionId);
      if (match) {
        return match.name;
      }
    }
    
    // If institution is a string but not a number, return as is
    if (typeof institution === 'string' && isNaN(institution)) {
      return institution;
    }
    
    // Fallback
    return loadingInstitutions ? "Loading..." : "N/A";
  };

  // Component for profile photo display
  const ProfilePhoto = ({ photo, userName }) => {
    const [imageError, setImageError] = useState(false);
    
    if (!photo || imageError) {
      return (
        <div className="w-32 h-32 bg-red-50 border-2 border-red-200 border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <User className="h-12 w-12 text-red-400 mx-auto mb-1" />
            <span className="text-xs text-red-500 font-medium">Photo Required</span>
          </div>
        </div>
      );
    }
  
    return (
      <img 
        src={photo} 
        alt={`${userName}'s profile`}
        className="w-32 h-32 object-cover rounded-lg border"
        onError={() => setImageError(true)}
      />
    );
  };

  const renderWorkExperience = () => {
    if (!profile.work_experience || !Array.isArray(profile.work_experience) || profile.work_experience.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No work experience added yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {profile.work_experience.map((exp, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{exp.position || "N/A"}</h4>
                <p className="text-muted-foreground font-medium">{exp.law_firm || "N/A"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {exp.start_date || "N/A"} - {exp.end_date || "N/A"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{exp.description || "No description provided"}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!profile.education || !Array.isArray(profile.education) || profile.education.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No education details added yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {profile.education.map((edu, index) => (
          <Card key={index} className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{edu.degree || "N/A"}</h4>
                <p className="text-muted-foreground font-medium">
                  {getInstitutionName(edu.institution)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {edu.start_date || "N/A"} - {edu.end_date || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
        {!profileExists && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Complete Your Profile</h3>
            <p className="text-blue-600">
              Your profile is not set up yet. Click "Edit Profile" below to add your information including a profile photo (required) and make your profile visible to potential clients.
            </p>
          </div>
        )}
          
          {/* Basic Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label>Name</Label><Input value={user.name} readOnly /></div>
              <div><Label>Email</Label><Input value={user.email} readOnly /></div>
              <div><Label>Phone</Label><Input value={formatValue(profile.phone)} readOnly /></div>
              <div><Label>City</Label><Input value={formatValue(profile.city?.name)} readOnly /></div>
              <div><Label>Law Type</Label><Input value={formatValue(profile.law_type?.name)} readOnly /></div>
              <div><Label>Fee</Label><Input value={profile.fee ? `₹${formatValue(profile.fee)}` : "N/A"} readOnly /></div>
              <div className="md:col-span-2">
                <Label>Experience</Label>
                <Input value={formatValue(profile.total_experience?.years || profile.total_experience?.name)} readOnly />
              </div>
              <div className="md:col-span-2">
                <Label>Practice Areas</Label>
                <Input
                  value={Array.isArray(profile.practice_area)
                    ? profile.practice_area.map((a) => a.name).join(", ") || "N/A"
                    : formatValue(profile.practice_area?.name)}
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <Label>Languages</Label>
                <Input
                  value={Array.isArray(profile.languages)
                    ? profile.languages.map((l) => l.name).join(", ") || "N/A"
                    : formatValue(profile.languages?.name)}
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <Label>About</Label>
                <Textarea value={formatValue(profile.about)} readOnly rows={4} />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Textarea value={formatValue(profile.address)} readOnly rows={3} />
              </div>
              <div className="md:col-span-2">
                <Label>Website</Label>
                <Input value={formatValue(profile.website)} readOnly />
              </div>
              
              {/* Profile Photo Section */}
              <div className="md:col-span-2">
                <Label>Profile Photo</Label>
                <div className="mt-2">
                  <ProfilePhoto photo={profile.photo} userName={user.name} />
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </h3>
            {renderWorkExperience()}
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education
            </h3>
            {renderEducation()}
          </div>

          {/* Availability Section (if available) */}
          {profile.availability && Array.isArray(profile.availability) && profile.availability.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Availability</h3>
              <Card className="p-4 bg-gray-50">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(profile.availability, null, 2)}
                </pre>
              </Card>
            </div>
          )}

          {/* Action Button */}
          <div className="text-right mt-6 pt-6 border-t">
            <Button onClick={onEdit} variant={profileExists ? "outline" : "default"}>
              {profileExists ? "Edit Profile" : "Complete Profile"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LawyerProfileView;