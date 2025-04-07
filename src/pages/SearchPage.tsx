
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();

  // Immediately redirect to the browse page
  useEffect(() => {
    navigate('/browse');
  }, [navigate]);

  return null;
};

export default SearchPage;
