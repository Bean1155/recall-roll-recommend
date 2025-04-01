
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnvelopeProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  label?: string;
}

const Envelope = ({ children, className, onClick, label }: EnvelopeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };
  
  return (
    <div 
      className={cn(
        "cursor-pointer mx-auto max-w-md", 
        className
      )}
      onClick={handleClick}
    >
      <div className="envelope relative bg-catalog-manila border border-catalog-softBrown rounded p-1 shadow-md overflow-hidden">
        {/* Envelope flap */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-8 bg-catalog-manila border-b border-catalog-softBrown z-10"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? -180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "top" }}
        />
        
        {/* Label on envelope */}
        {label && (
          <div className="absolute bottom-2 left-0 w-full text-center z-5 text-catalog-softBrown font-typewriter text-sm">
            {label}
          </div>
        )}
        
        {/* Card inside envelope */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isOpen ? -20 : 0 }}
          transition={{ duration: 0.3, delay: isOpen ? 0.2 : 0 }}
          className="pt-10 pb-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default Envelope;
