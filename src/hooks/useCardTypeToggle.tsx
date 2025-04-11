
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type CardType = 'food' | 'entertainment';

interface UseCardTypeToggleOptions {
  defaultType?: CardType;
  navigateOnChange?: boolean;
}

export function useCardTypeToggle({
  defaultType = 'food',
  navigateOnChange = false
}: UseCardTypeToggleOptions = {}) {
  const [currentType, setCurrentType] = useState<CardType>(defaultType);
  const navigate = useNavigate();
  
  const handleTypeChange = useCallback((type: CardType) => {
    setCurrentType(type);
    
    if (navigateOnChange) {
      const path = type === 'food' ? '/bites' : '/blockbusters';
      navigate(path);
    }
  }, [navigate, navigateOnChange]);
  
  return {
    currentType,
    handleTypeChange
  };
}

export default useCardTypeToggle;
