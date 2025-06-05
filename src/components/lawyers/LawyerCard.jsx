
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, Award } from "lucide-react";

const LawyerCard = ({ lawyer }) => {
  return (
    <Card className="h-full lawyer-card overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[3/2] w-full bg-muted relative">
          {lawyer.image ? (
            <img 
              src={lawyer.image} 
              alt={`${lawyer.name}, ${lawyer.specialty} attorney`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <img  alt={`Portrait of ${lawyer.name}, ${lawyer.specialty} attorney`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1636369555100-e0ba574af653" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{lawyer.rating}</span>
            <span className="text-muted-foreground">({lawyer.reviews})</span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-1">{lawyer.name}</h3>
          <p className="text-primary font-medium mb-3">{lawyer.specialty}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin size={14} className="mr-2 text-muted-foreground/70" />
              {lawyer.location}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Briefcase size={14} className="mr-2 text-muted-foreground/70" />
              {lawyer.experience} years experience
            </div>
            {lawyer.certifications && (
              <div className="flex items-center text-muted-foreground text-sm">
                <Award size={14} className="mr-2 text-muted-foreground/70" />
                {lawyer.certifications}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Link to={`/lawyers/${lawyer.id}`} className="flex-1">
              <Button variant="outline" className="w-full">View Profile</Button>
            </Link>
            <Link to={`/book/${lawyer.id}`} className="flex-1">
              <Button className="w-full">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LawyerCard;
