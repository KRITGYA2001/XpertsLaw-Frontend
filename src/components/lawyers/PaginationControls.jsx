import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPreviousPage, 
  goToNextPage, 
  goToPreviousPage, 
  goToPage 
}) => {
  if (totalPages <= 1) return null;

  return (
    <>
      {/* Pagination Controls */}
      <div className="flex items-center justify-center mt-8 space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            
            // Show first page, last page, current page, and 2 pages around current
            const showPage = pageNumber === 1 || 
                           pageNumber === totalPages || 
                           Math.abs(pageNumber - currentPage) <= 1;
            
            if (!showPage) {
              // Show ellipsis for gaps
              if (pageNumber === 2 && currentPage > 4) {
                return <span key={pageNumber} className="px-2 text-muted-foreground">...</span>;
              }
              if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                return <span key={pageNumber} className="px-2 text-muted-foreground">...</span>;
              }
              return null;
            }

            return (
              <Button
                key={pageNumber}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(pageNumber)}
                className="w-10 h-10"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Page Info */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </>
  );
};

export default PaginationControls;