import React, { useState, useEffect } from "react";
import LawyerCard from "@/components/lawyers/LawyerCard";
import LawyerFilters from "@/components/lawyers/LawyerFilters";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

const LawyersPage = () => {
  const allLawyers = [
    {
      id: "lawyer-1",
      name: "Priya Sharma",
      specialty: "Family Law",
      rating: 4.9,
      reviews: 127,
      location: "Mumbai, MH",
      experience: 12,
      certifications: "Board Certified Family Law Specialist (India)",
      image: "https://images.unsplash.com/photo-1600267185393-e158a781b353",
      consultationFee: "₹2500",
    },
    {
      id: "lawyer-2",
      name: "Rajesh Kumar",
      specialty: "Corporate Law",
      rating: 4.8,
      reviews: 93,
      location: "Bangalore, KA",
      experience: 15,
      certifications: "Corporate Law Expert (India)",
      image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
      consultationFee: "₹3000",
    },
    {
      id: "lawyer-3",
      name: "Aisha Khan",
      specialty: "Cyber Law",
      rating: 4.9,
      reviews: 156,
      location: "Delhi, DL",
      experience: 10,
      certifications: "Certified Cyber Law Professional",
      image: "https://images.unsplash.com/photo-1589254066007-388213c6a9a6",
      consultationFee: "₹2800",
    },
    {
      id: "lawyer-4",
      name: "Vikram Singh",
      specialty: "Criminal Law",
      rating: 4.7,
      reviews: 112,
      location: "Pune, MH",
      experience: 18,
      certifications: "Criminal Law Expert (India)",
      image: "https://images.unsplash.com/photo-1610642372651-fe6e7bc20934",
      consultationFee: "₹3500",
    },
    {
      id: "lawyer-5",
      name: "Sunita Reddy",
      specialty: "Property Law",
      rating: 4.6,
      reviews: 87,
      location: "Hyderabad, TS",
      experience: 8,
      certifications: "Real Estate Law Specialist (India)",
      image: "https://images.unsplash.com/photo-1507591064342-c575625a0136",
      consultationFee: "₹2200",
    },
    {
      id: "lawyer-6",
      name: "Amit Patel",
      specialty: "Tax Law",
      rating: 4.8,
      reviews: 142,
      location: "Ahmedabad, GJ",
      experience: 14,
      certifications: "Chartered Accountant & Tax Lawyer",
      image: "https://images.unsplash.com/photo-1590650213165-c69ce7f9565f",
      consultationFee: "₹3200",
    },
    {
      id: "lawyer-7",
      name: "Deepika Das",
      specialty: "Labour Law",
      rating: 4.7,
      reviews: 98,
      location: "Kolkata, WB",
      experience: 9,
      certifications: "Employment Law Expert (India)",
      image: "https://images.unsplash.com/photo-1542744095-291d1f67b221",
      consultationFee: "₹2600",
    },
    {
      id: "lawyer-8",
      name: "Arjun Mehta",
      specialty: "Intellectual Property",
      rating: 4.9,
      reviews: 115,
      location: "Chennai, TN",
      experience: 16,
      certifications: "Patent Attorney (India)",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      consultationFee: "₹4000",
    },
  ];

  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "all",
    experience: "all",
    practiceAreas: [],
    rating: "all",
  });

  const [filteredLawyers, setFilteredLawyers] = useState(allLawyers);
  const [activeFilters, setActiveFilters] = useState([]);

  const indianCitiesMap = {
    "mumbai": "Mumbai, MH",
    "delhi": "Delhi, DL",
    "bangalore": "Bangalore, KA",
    "hyderabad": "Hyderabad, TS",
    "chennai": "Chennai, TN",
    "kolkata": "Kolkata, WB",
    "pune": "Pune, MH",
    "ahmedabad": "Ahmedabad, GJ",
  };

  const applyFilters = () => {
    let filtered = [...allLawyers];
    const newActiveFilters = [];

    if (filters.searchTerm) {
      filtered = filtered.filter(
        lawyer =>
          lawyer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          lawyer.specialty.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
      newActiveFilters.push({ type: 'searchTerm', value: filters.searchTerm, display: `"${filters.searchTerm}"` });
    }

    if (filters.location !== 'all') {
      filtered = filtered.filter(lawyer => lawyer.location === indianCitiesMap[filters.location]);
      newActiveFilters.push({ type: 'location', value: filters.location, display: `Location: ${indianCitiesMap[filters.location]}` });
    }

    if (filters.experience !== 'all') {
      if (filters.experience === '1-5') {
        filtered = filtered.filter(lawyer => lawyer.experience >= 1 && lawyer.experience <= 5);
      } else if (filters.experience === '5-10') {
        filtered = filtered.filter(lawyer => lawyer.experience > 5 && lawyer.experience <= 10);
      } else if (filters.experience === '10+') {
        filtered = filtered.filter(lawyer => lawyer.experience > 10);
      } else if (filters.experience === '20+') {
        filtered = filtered.filter(lawyer => lawyer.experience >= 20);
      }
      newActiveFilters.push({ type: 'experience', value: filters.experience, display: `Experience: ${filters.experience} years` });
    }

    if (filters.practiceAreas.length > 0) {
      filtered = filtered.filter(lawyer => 
        filters.practiceAreas.some(area => lawyer.specialty.toLowerCase().includes(area.toLowerCase()))
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
    setFilteredLawyers(allLawyers);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
          {activeFilters.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-muted rounded-full px-3 py-1 text-sm"
                  >
                    <span>{filter.display}</span>
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {filteredLawyers.length > 0 ? (
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
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No lawyers found</h3>
              <p className="text-muted-foreground mb-6">
                No lawyers match your current filter criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyersPage;