
import React from 'react';

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
  isOpen = false,
  onClick
}) => {
  return (
    <div 
      className={`envelope ${isOpen ? 'envelope-open' : 'envelope-closed'} ${className}`}
      onClick={onClick}
    >
      {label && (
        <div className="envelope-tab flex items-center justify-center z-10 relative">
          <span className="text-xs font-bold" style={{ color: labelColor }}>{label}</span>
        </div>
      )}
      <div className={`envelope-flap ${isOpen ? 'envelope-flap-open' : ''}`}></div>
      <div className="envelope-content p-3 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Envelope;
