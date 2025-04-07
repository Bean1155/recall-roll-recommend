
import React, { useState, useEffect, useCallback } from "react";
import GridLayout from "@/components/GridLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const SearchPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  // Immediately redirect to the browse page
  useEffect(() => {
    navigate('/browse');
  }, [navigate]);

  return (
    <GridLayout title="Browse Catalog">
      <div className="p-4 text-center">
        Redirecting to browse page...
      </div>
    </GridLayout>
  );
};

export default SearchPage;
