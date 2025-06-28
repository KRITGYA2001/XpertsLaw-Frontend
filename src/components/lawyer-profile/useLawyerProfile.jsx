import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = "http://xpertslaw-backend-env.eba-s2nkai2i.us-east-1.elasticbeanstalk.com";

const fetchWithRetry = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        const text = await response.text();
        if (text.includes("86400")) throw new Error("Rate limited for 24 hours");
        await new Promise((res) => setTimeout(res, Math.pow(2, i) * 1000));
        continue;
      }
      return response;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
};

export const useLawyerProfile = (user) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    cities: [], 
    lawTypes: [], 
    experiences: [], 
    languages: [], 
    practiceAreas: [], 
    institutions: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/lawyers/lawyers/?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.status === 404) {
        setProfile(null);
        setProfileExists(false);
        return;
      }
      const result = await res.json();
      const data = result?.data?.[0] || result?.data?.data?.[0] || result?.data;
      if (data) {
        setProfile(data);
        setProfileExists(true);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load profile data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await fetchWithRetry(`${API_BASE}/lawyers/lawyers/?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.status === 404) {
        setProfile(null);
        setProfileExists(false);
        return;
      }
      const result = await res.json();
      const data = result?.data?.[0] || result?.data?.data?.[0] || result?.data;
      if (data) {
        setProfile(data);
        setProfileExists(true);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to refresh profile.", variant: "destructive" });
    }
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const opts = { headers: { Authorization: `Bearer ${user.token}` } };
        const fetchWithDelay = async (url, delay = 0) => {
          if (delay) await new Promise((res) => setTimeout(res, delay));
          return fetchWithRetry(url, opts).then((r) => r.json());
        };
        
        // Removed institutions API call since it's only needed for EducationForm
        const [cities, lawTypes, experiences, languages, practiceAreas] = await Promise.all([
          fetchWithDelay(`${API_BASE}/lawyers/cities/`),
          fetchWithDelay(`${API_BASE}/lawyers/law_types/`, 200),
          fetchWithDelay(`${API_BASE}/lawyers/total_experiences/`, 400),
          fetchWithDelay(`${API_BASE}/lawyers/languages/`, 600),
          fetchWithDelay(`${API_BASE}/lawyers/practice_areas/`, 800),
        ]);
        
        setDropdowns({
          cities: cities?.data?.data || [],
          lawTypes: lawTypes?.data?.data || [],
          experiences: experiences?.data?.data || [],
          languages: languages?.data?.data || [],
          practiceAreas: practiceAreas?.data?.data || [],
          institutions: [], // Will be fetched separately in EducationForm
        });
      } catch (err) {
        toast({ title: "Error", description: "Failed to load form options.", variant: "destructive" });
      }
    };

    if (user?.token) {
      fetchDropdowns();
      fetchProfile();
    }
  }, [user]);

  // Return refreshProfile function so it can be used in components
  return { 
    profile, 
    profileExists, 
    dropdowns, 
    loading, 
    setProfile, 
    setProfileExists, 
    refreshProfile 
  };
};