import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const practiceAreas = [
  "Family Law",
  "Criminal Law",
  "Corporate Law",
  "Property Law",
  "Labour Law",
  "Cyber Law",
  "Intellectual Property",
  "Tax Law",
  "Consumer Protection",
  "Environmental Law",
];

const indianCities = [
  { value: "mumbai", label: "Mumbai, MH" },
  { value: "delhi", label: "Delhi, DL" },
  { value: "bangalore", label: "Bangalore, KA" },
  { value: "hyderabad", label: "Hyderabad, TS" },
  { value: "chennai", label: "Chennai, TN" },
  { value: "kolkata", label: "Kolkata, WB" },
  { value: "pune", label: "Pune, MH" },
  { value: "ahmedabad", label: "Ahmedabad, GJ" },
];

const LawyerFilters = ({ filters, setFilters, applyFilters, resetFilters }) => {
  const handleCheckboxChange = (area) => {
    const updatedAreas = filters.practiceAreas.includes(area)
      ? filters.practiceAreas.filter(a => a !== area)
      : [...filters.practiceAreas, area];
    
    setFilters({
      ...filters,
      practiceAreas: updatedAreas
    });
  };

  return (
    <div className="bg-background rounded-lg border p-5 space-y-6 sticky top-20">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or keyword"
            className="pl-9"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-2 block">Location</Label>
        <Select
          value={filters.location}
          onValueChange={(value) => setFilters({ ...filters, location: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {indianCities.map(city => (
              <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium mb-2 block">Experience Level</Label>
        <Select
          value={filters.experience}
          onValueChange={(value) => setFilters({ ...filters, experience: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Experience</SelectItem>
            <SelectItem value="1-5">1-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
            <SelectItem value="20+">20+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">Practice Areas</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {practiceAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={`area-${area.toLowerCase().replace(/\s+/g, '-')}`}
                checked={filters.practiceAreas.includes(area)}
                onCheckedChange={() => handleCheckboxChange(area)}
              />
              <label
                htmlFor={`area-${area.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {area}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-2 block">Rating</Label>
        <Select
          value={filters.rating}
          onValueChange={(value) => setFilters({ ...filters, rating: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Rating</SelectItem>
            <SelectItem value="4.5+">4.5 & Above</SelectItem>
            <SelectItem value="4+">4.0 & Above</SelectItem>
            <SelectItem value="3.5+">3.5 & Above</SelectItem>
            <SelectItem value="3+">3.0 & Above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-3 pt-2">
        <Button onClick={applyFilters} className="w-full gap-2">
          <Search size={16} />
          Apply Filters
        </Button>
        <Button variant="outline" onClick={resetFilters} className="w-full gap-2">
          <X size={16} />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default LawyerFilters;