// LawyerProfilePage.jsx (Fixed photo upload bug)
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useLawyerProfile } from "@/components/lawyer-profile/useLawyerProfile";
import LawyerProfileForm from "@/components/lawyer-profile/LawyerProfileForm";
import LawyerProfileView from "@/components/lawyer-profile/LawyerProfileView";
import WorkExperienceForm from "@/components/lawyer-profile/WorkExperienceForm";
import EducationForm from "@/components/lawyer-profile/EducationForm";

const STEPS = {
  VIEW: 'view',
  BASIC_INFO: 'basic_info',
  WORK_EXPERIENCE: 'work_experience',
  EDUCATION: 'education'
};

const LawyerProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, profileExists, dropdowns, loading, setProfile, setProfileExists, refreshProfile } = useLawyerProfile(user);
  const [currentStep, setCurrentStep] = useState(STEPS.VIEW);
  const [formData, setFormData] = useState({
    phone: "",
    city: "",
    law_type: "",
    fee: "",
    total_experience: "",
    practice_area: "",
    languages: "",
    about: "",
    address: "",
    website: "",
    photo: ""
  });
  const [workExperiences, setWorkExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false); // Track if photo was changed

  const API_BASE = "http://xpertslaw-backend-env.eba-s2nkai2i.us-east-1.elasticbeanstalk.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveBasicInfo = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("user", user.id);
      
      // Handle all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'institution' && key !== 'photo') { 
          // Handle photo separately
          form.append(key, value.toString());
        }
      });

      // Handle photo field properly
      if (formData.photo) {
        if (formData.photo instanceof File) {
          // New photo file uploaded
          form.append('photo', formData.photo);
        } else if (typeof formData.photo === 'string' && !photoChanged) {
          // Existing photo URL - don't include in form data for update
          // The backend will keep the existing photo if not provided
          console.log('Keeping existing photo, not sending photo field');
        } else if (typeof formData.photo === 'string' && photoChanged) {
          // This shouldn't happen, but handle it just in case
          console.log('Photo changed but got string instead of file');
        }
      }

      const method = profileExists ? "PUT" : "POST";
      const url = profileExists
        ? `${API_BASE}/lawyers/lawyers/${profile.id}/`
        : `${API_BASE}/lawyers/lawyers/`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${user.token}` },
        body: form,
      });

      const result = await res.json();
      if (!res.ok) {
        console.error('Basic info save error:', result);
        throw new Error(result.message || "Failed to save basic info");
      }

      toast({ 
        title: "Basic Info Saved", 
        description: "Moving to work experience section." 
      });
      
      await refreshProfile();
      setCurrentStep(STEPS.WORK_EXPERIENCE);
    } catch (err) {
      console.error('Save basic info error:', err);
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const saveWorkExperience = async (experiences) => {
    setSubmitting(true);
    try {
      // Delete existing work experiences first
      if (profile?.work_experience?.length > 0) {
        for (const exp of profile.work_experience) {
          await fetch(`${API_BASE}/lawyers/work_experiences/${exp.id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user.token}` }
          });
        }
      }

      // Add new work experiences
      for (const exp of experiences) {
        const workExpData = new FormData();
        workExpData.append("lawyer", profile.id);
        workExpData.append("law_firm", exp.law_firm);
        workExpData.append("position", exp.position);
        workExpData.append("start_date", exp.start_date);
        workExpData.append("end_date", exp.end_date);
        workExpData.append("description", exp.description);

        const res = await fetch(`${API_BASE}/lawyers/work_experiences/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
          body: workExpData,
        });

        if (!res.ok) {
          const result = await res.json();
          console.error('Work experience save error:', result);
          throw new Error(result.message || "Failed to save work experience");
        }
      }

      toast({ 
        title: "Work Experience Saved", 
        description: "Moving to education section." 
      });
      
      setWorkExperiences(experiences);
      setCurrentStep(STEPS.EDUCATION);
    } catch (err) {
      console.error('Save work experience error:', err);
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const saveEducation = async (educationList) => {
    setSubmitting(true);
    try {
      console.log('Saving education list:', educationList); // Debug log
      
      // Delete existing education first
      if (profile?.education?.length > 0) {
        for (const edu of profile.education) {
          await fetch(`${API_BASE}/lawyers/educations/${edu.id}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user.token}` }
          });
        }
      }

      // Add new education
      for (const edu of educationList) {
        const eduData = new FormData();
        eduData.append("lawyer", profile.id);
        
        // Handle institution ID properly
        const institutionId = edu.institution?.id || edu.institution;
        if (!institutionId) {
          throw new Error("Institution ID is required for education entry");
        }
        
        eduData.append("institution", institutionId);
        eduData.append("degree", edu.degree);
        eduData.append("start_date", edu.start_date);
        eduData.append("end_date", edu.end_date);

        console.log('Sending education data:', {
          lawyer: profile.id,
          institution: institutionId,
          degree: edu.degree,
          start_date: edu.start_date,
          end_date: edu.end_date
        });

        const res = await fetch(`${API_BASE}/lawyers/educations/`, {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
          body: eduData,
        });

        if (!res.ok) {
          const result = await res.json();
          console.error('Education save error:', result);
          throw new Error(result.message || "Failed to save education");
        }
      }

      toast({ 
        title: profileExists ? "Profile Updated" : "Profile Created", 
        description: "All information saved successfully." 
      });
      
      setEducations(educationList);
      await refreshProfile();
      setCurrentStep(STEPS.VIEW);
    } catch (err) {
      console.error('Save education error:', err);
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = () => {
    // Reset photo changed flag
    setPhotoChanged(false);
    
    // If profile exists, populate form with existing data
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        city: profile.city?.id?.toString() || "",
        law_type: profile.law_type?.id?.toString() || "",
        fee: profile.fee || "",
        total_experience: profile.total_experience?.id?.toString() || "",
        practice_area: Array.isArray(profile.practice_area) 
          ? profile.practice_area[0]?.id?.toString() || "" 
          : profile.practice_area?.id?.toString() || "",
        languages: Array.isArray(profile.languages) 
          ? profile.languages[0]?.id?.toString() || "" 
          : profile.languages?.id?.toString() || "",
        about: profile.about || "",
        address: profile.address || "",
        website: profile.website || "",
        photo: profile.photo || "", // This will be the existing photo URL or empty
      });
      setWorkExperiences(profile.work_experience || []);
      setEducations(profile.education || []);
    } else {
      // If no profile exists, start with empty form
      setFormData({
        phone: "",
        city: "",
        law_type: "",
        fee: "",
        total_experience: "",
        practice_area: "",
        languages: "",
        about: "",
        address: "",
        website: "",
        photo: ""
      });
      setWorkExperiences([]);
      setEducations([]);
    }
    setCurrentStep(STEPS.BASIC_INFO);
  };

  const cancelEditing = () => {
    setCurrentStep(STEPS.VIEW);
    setPhotoChanged(false);
    // Reset form data
    setFormData({
      phone: "",
      city: "",
      law_type: "",
      fee: "",
      total_experience: "",
      practice_area: "",
      languages: "",
      about: "",
      address: "",
      website: "",
      photo: ""
    });
    setWorkExperiences([]);
    setEducations([]);
  };

  // Handle case where user is not loaded yet
  if (!user) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Render based on current step
  switch (currentStep) {
    case STEPS.BASIC_INFO:
      // Check if required dropdowns are loaded (excluding institutions)
      if (
        !dropdowns.cities.length ||
        !dropdowns.lawTypes.length ||
        !dropdowns.experiences.length ||
        !dropdowns.languages.length ||
        !dropdowns.practiceAreas.length
      ) {
        return (
          <div className="container py-10 text-center text-muted-foreground">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            Loading form options...
          </div>
        );
      }
      
      return (
        <LawyerProfileForm
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handleSubmit={saveBasicInfo}
          submitting={submitting}
          dropdowns={dropdowns}
          onCancel={cancelEditing}
          isEditing={profileExists}
          photoChanged={photoChanged}
          setPhotoChanged={setPhotoChanged}
        />
      );

    case STEPS.WORK_EXPERIENCE:
      return (
        <WorkExperienceForm
          workExperiences={workExperiences}
          onSave={saveWorkExperience}
          onCancel={cancelEditing}
          submitting={submitting}
          user={user}
        />
      );

    case STEPS.EDUCATION:
      return (
        <EducationForm
          educations={educations}
          institutions={dropdowns.institutions}
          onSave={saveEducation}
          onCancel={cancelEditing}
          submitting={submitting}
          user={user}
          isEditing={profileExists}
        />
      );

    case STEPS.VIEW:
    default:
      // Always show profile view (even if no profile exists)
      // Create a dummy profile object if none exists
      const displayProfile = profile || {
        phone: null,
        city: null,
        law_type: null,
        fee: null,
        total_experience: null,
        practice_area: null,
        languages: null,
        about: null,
        address: null,
        website: null,
        photo: null,
        availability: null,
        work_experience: null,
        education: null
      };

      return (
        <LawyerProfileView 
          profile={displayProfile} 
          user={user} 
          onEdit={startEditing}
          profileExists={profileExists}
        />
      );
  }
};

export default LawyerProfilePage;