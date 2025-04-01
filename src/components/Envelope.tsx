
import React from 'react';

interface EnvelopeProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  labelColor?: string;
}

const Envelope: React.FC<EnvelopeProps> = ({ label, children, className, labelColor = '#9E8979' }) => {
  return (
    <div className={`envelope ${className}`}>
      {label && (
        <div className="envelope-tab flex items-center justify-center z-10 relative">
          <span className="text-xs font-bold" style={{ color: labelColor }}>{label}</span>
        </div>
      )}
      <div className="envelope-flap"></div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};

export default Envelope;
