import React, { useState, useEffect } from "react";
import LawyerCard from "@/components/lawyers/LawyerCard";
import LawyerFilters from "@/components/lawyers/LawyerFilters";
import PaginationControls from "@/components/lawyers/PaginationControls";
import ActiveFiltersBar from "@/components/lawyers/ActiveFiltersBar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const LawyersPage = () => {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "all",
    experience: "all",
    practiceAreas: [],
    rating: "all",
  });

  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  // Fetch lawyers for specific page
  const fetchLawyers = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {};
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }
      
      const response = await fetch(`${API_BASE}/lawyers/lawyers/?page=${page}&page_size=${pageSize}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle different possible response structures
      let pageData = [];
      
      if (result?.data?.data) {
        pageData = Array.isArray(result.data.data) ? result.data.data : [];
      } else if (result?.data) {
        pageData = Array.isArray(result.data) ? result.data : [];
      } else if (result?.results) {
        pageData = Array.isArray(result.results) ? result.results : [];
      } else if (Array.isArray(result)) {
        pageData = result;
      }
      
      // Transform API data
      const transformedLawyers = pageData
        .filter(lawyer => lawyer.user)
        .map(lawyer => {
          const firstName = lawyer.user?.first_name || "";
          const lastName = lawyer.user?.last_name || "";
          const fullName = `${firstName} ${lastName}`.trim() || lawyer.user?.name || "Unknown Lawyer";

          return {
            id: lawyer.id || `lawyer-${lawyer.user?.id}`,
            name: fullName,
            specialty: lawyer.law_type?.name || "General Practice",
            rating: lawyer.rating || 4.5,
            reviews: lawyer.reviews_count || 0,
            location: lawyer.city?.name || "Location not specified",
            experience: lawyer.total_experience?.years || 
                       lawyer.total_experience?.name || 
                       "Experience not specified",
            certifications: lawyer.certifications || null,
            image: lawyer.photo || null,
            consultationFee: lawyer.fee ? `₹${lawyer.fee}` : "Fee not specified",
            about: lawyer.about,
            practiceAreas: Array.isArray(lawyer.practice_area) 
              ? lawyer.practice_area.map(area => area.name).join(", ")
              : lawyer.practice_area?.name || "",
            languages: Array.isArray(lawyer.languages)
              ? lawyer.languages.map(lang => lang.name).join(", ")
              : lawyer.languages?.name || "",
            address: lawyer.address,
            website: lawyer.website,
            phone: lawyer.phone,
            profileData: lawyer
          };
        });

      setLawyers(transformedLawyers);
      setFilteredLawyers(transformedLawyers);
      
      // Update pagination info
      const pagination = result?.data?.pagination || result?.pagination || {};
      setTotalCount(pagination.count || 0);
      setHasNextPage(!!pagination.next);
      setHasPreviousPage(!!pagination.previous);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      setError(err.message);
      setLawyers([]);
      setFilteredLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers(1);
  }, [user]);

  // Navigation functions
  const goToNextPage = () => {
    if (hasNextPage) {
      fetchLawyers(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      fetchLawyers(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    fetchLawyers(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  const applyFilters = () => {
    let filtered = [...lawyers];
    const newActiveFilters = [];

    if (filters.searchTerm) {
      filtered = filtered.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          lawyer.specialty.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          lawyer.practiceAreas.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
      newActiveFilters.push({ type: 'searchTerm', value: filters.searchTerm, display: `"${filters.searchTerm}"` });
    }

    if (filters.location !== 'all') {
      filtered = filtered.filter(lawyer => 
        lawyer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
      newActiveFilters.push({ type: 'location', value: filters.location, display: `Location: ${filters.location}` });
    }

    if (filters.experience !== 'all') {
      filtered = filtered.filter(lawyer => {
        const experience = typeof lawyer.experience === 'string' 
          ? parseInt(lawyer.experience.match(/\d+/)?.[0] || '0')
          : lawyer.experience || 0;
        
        if (filters.experience === '1-5') {
          return experience >= 1 && experience <= 5;
        } else if (filters.experience === '5-10') {
          return experience > 5 && experience <= 10;
        } else if (filters.experience === '10+') {
          return experience > 10;
        } else if (filters.experience === '20+') {
          return experience >= 20;
        }
        return true;
      });
      newActiveFilters.push({ type: 'experience', value: filters.experience, display: `Experience: ${filters.experience} years` });
    }

    if (filters.practiceAreas.length > 0) {
      filtered = filtered.filter(lawyer => 
        filters.practiceAreas.some(area => 
          lawyer.specialty.toLowerCase().includes(area.toLowerCase()) ||
          lawyer.practiceAreas.toLowerCase().includes(area.toLowerCase())
        )
      );
      filters.practiceAreas.forEach(area => {
        newActiveFilters.push({ type: 'practiceArea', value: area, display: area });
      });
    }

    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating.replace('+', ''));
      filtered = filtered.filter(lawyer => lawyer.rating >= minRating);
      newActiveFilters.push({ type: 'rating', value: filters.rating, display: `Rating: ${filters.rating}` });
    }

    setFilteredLawyers(filtered);
    setActiveFilters(newActiveFilters);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      location: "all",
      experience: "all",
      practiceAreas: [],
      rating: "all",
    });
    setFilteredLawyers(lawyers);
    setActiveFilters([]);
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.type === 'searchTerm') {
      setFilters(prev => ({ ...prev, searchTerm: '' }));
    } else if (filterToRemove.type === 'location') {
      setFilters(prev => ({ ...prev, location: 'all' }));
    } else if (filterToRemove.type === 'experience') {
      setFilters(prev => ({ ...prev, experience: 'all' }));
    } else if (filterToRemove.type === 'practiceArea') {
      setFilters(prev => ({
        ...prev,
        practiceAreas: prev.practiceAreas.filter(area => area !== filterToRemove.value)
      }));
    } else if (filterToRemove.type === 'rating') {
      setFilters(prev => ({ ...prev, rating: 'all' }));
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters, lawyers]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
          <p className="text-muted-foreground">
            Connect with experienced attorneys specializing in various practice areas across India
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lawyers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
          <p className="text-muted-foreground">
            Connect with experienced attorneys specializing in various practice areas across India
          </p>
        </div>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <Search className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-red-800">Error Loading Lawyers</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => fetchLawyers(1)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Lawyer</h1>
        <p className="text-muted-foreground">
          Connect with experienced attorneys specializing in various practice areas across India
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <LawyerFilters
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {/* Results summary */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount} lawyers
            </p>
          </div>

          {/* Active Filters - Now using component */}
          <ActiveFiltersBar
            activeFilters={activeFilters}
            removeFilter={removeFilter}
            resetFilters={resetFilters}
          />

          {filteredLawyers.length > 0 ? (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredLawyers.map((lawyer) => (
                  <motion.div key={lawyer.id} variants={item}>
                    <LawyerCard lawyer={lawyer} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination - Now using component */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                goToPage={goToPage}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No lawyers found</h3>
              <p className="text-muted-foreground mb-6">
                {lawyers.length === 0 
                  ? "No lawyers found."
                  : "No lawyers match your current filter criteria. Try adjusting your filters or search terms."
                }
              </p>
              {lawyers.length > 0 ? (
                <Button onClick={resetFilters}>Reset Filters</Button>
              ) : (
                <Button onClick={() => fetchLawyers(1)}>Refresh</Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyersPage;