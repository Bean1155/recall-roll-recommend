
import React, { useState } from 'react';

interface EnvelopeProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  labelColor?: string;
  isOpen?: boolean;
  onClick?: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ 
  label, 
  children, 
  className = '', 
  labelColor = '#9E8979',
  isOpen: initialIsOpen = false,
  onClick
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={`envelope relative cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div 
        className={`envelope-pocket relative transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-6' : ''}`}
        style={{
          backgroundColor: '#E6D7B8', 
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '12px 12px 32px 12px',
          border: '1px solid #9E8979',
          borderTop: 'none',
          minHeight: '80px',
          width: '100%',
          zIndex: 1
        }}
      >
        {label && (
          <div 
            className="absolute bottom-2 left-0 right-0 text-center"
            style={{ color: labelColor, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px' }}
          >
            {label}
          </div>
        )}
      </div>
      
      <div 
        className={`envelope-card bg-white relative transition-all duration-300 ease-in-out shadow-md border border-catalog-softBrown ${isOpen ? 'translate-y-[-30px]' : ''}`}
        style={{
          zIndex: 2,
          marginTop: '-20px',
          padding: '12px',
          borderRadius: '4px'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Envelope;
