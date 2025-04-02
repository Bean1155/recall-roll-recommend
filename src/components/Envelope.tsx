
import React, { useState } from 'react';

interface EnvelopeProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  labelColor?: string;
  isOpen?: boolean;
  onClick?: () => void;
  backgroundColor?: string;
}

const Envelope: React.FC<EnvelopeProps> = ({ 
  label, 
  children, 
  className = '', 
  labelColor,
  isOpen: initialIsOpen = false,
  onClick,
  backgroundColor = '#E6D7B8'
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };
  
  // Calculate text color based on background
  const getTextColor = (bgColor: string): string => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark backgrounds, dark brown for light backgrounds
    return brightness > 145 ? "#603913" : "#ffffff";
  };
  
  const textColor = labelColor || getTextColor(backgroundColor);
  
  return (
    <div 
      className={`envelope relative cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div 
        className={`envelope-pocket relative transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-6' : ''}`}
        style={{
          backgroundColor: backgroundColor, 
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '12px 12px 32px 12px',
          border: '1px solid',
          borderColor: backgroundColor,
          borderTop: 'none',
          minHeight: '80px',
          width: '100%',
          zIndex: 1
        }}
      >
      </div>
      
      <div 
        className={`envelope-card bg-white relative transition-all duration-300 ease-in-out shadow-md ${isOpen ? 'translate-y-[-30px]' : ''}`}
        style={{
          zIndex: 2,
          marginTop: '-20px',
          padding: '12px',
          borderRadius: '4px',
          backgroundImage: `
            linear-gradient(#9E8979 1px, transparent 1px),
            linear-gradient(90deg, #9E8979 1px, transparent 1px)
          `,
          backgroundSize: '100% 28px, 33.33% 100%',
          backgroundPosition: '0 0',
          backgroundRepeat: 'repeat-y, repeat-x',
          borderWidth: '1px',
          borderColor: '#9E8979',
          borderStyle: 'solid',
          position: 'relative'
        }}
      >
        {label && (
          <div 
            className="border rounded-t-md absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[calc(100%-1px)] z-10"
            style={{ 
              backgroundColor: backgroundColor,
              borderColor: backgroundColor,
              color: textColor, 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              fontSize: '14px',
              letterSpacing: '0.5px',
              padding: '6px 12px',
              boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {label}
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Envelope;
