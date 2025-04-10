
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('term');
  const type = searchParams.get('type') || 'food';

  // Redirect to the appropriate page based on the type parameter
  useEffect(() => {
    if (searchTerm) {
      // If search term is provided, redirect to the corresponding page with search parameters
      const targetPath = type === 'entertainment' ? '/blockbusters' : '/bites';
      navigate(`${targetPath}?search=${searchTerm}&fromSearch=true`);
    } else {
      // If no search term, just redirect to browse with the correct type
      navigate(`/browse?type=${type}`);
    }
  }, [navigate, searchTerm, type]);

  return null;
};

export default SearchPage;
