
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, SkipForward } from "lucide-react";
import OnboardingStep from "./OnboardingStep";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface OnboardingScreenProps {
  forcedOpen?: boolean;
  onClose?: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  forcedOpen = false,
  onClose
}) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  // Check if user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);
  
  const onboardingSteps = [
    {
      title: "Welcome to",
      subtitle: "TOTAL RECALL CATALOG",
      description: "Your personal library for tracking and sharing your favorite bites and blockbusters.",
      image: "/lovable-uploads/8408dab2-58e0-488d-927d-f0930cf39585.png",
      backgroundColor: "#FFDEE2", // Light pink for Bites
      stepType: "intro"
    },
    {
      title: "TRACK YOUR BITES AND BLOCKBUSTERS",
      description: "WE RECALL SO YOU DON'T HAVE TO!",
      image: "/lovable-uploads/8408dab2-58e0-488d-927d-f0930cf39585.png",
      backgroundColor: "#FFDEE2", // Light pink for Bites
      stepType: "bites"
    },
    {
      title: "Create Your Personal Library",
      description: "", // Removed the description text here
      image: "/lovable-uploads/c1229700-5ec5-4c21-baef-dc535d219a0e.png",
      backgroundColor: "#D3E4FD", // Light blue for Blockbusters
      stepType: "blockbusters"
    },
    {
      title: "Share Your Discoveries",
      description: "Recommend your favorite finds to friends and track who follows your suggestions.",
      image: "/lovable-uploads/fafe4c18-7a01-4f90-8483-06834c0e1170.png",
      backgroundColor: "#e18336", // Orange from catalog
      stepType: "other"
    },
    {
      title: "Earn Rewards",
      description: "Collect points for adding and sharing catalog cards and become a Happy Sharer!",
      image: "/lovable-uploads/7fb0b78f-1a67-4fae-8211-8416211d5728.png", 
      backgroundColor: "#D8E4C8", // Light green from catalog
      stepType: "other"
    }
  ];
  
  const handleComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setOpen(false);
    if (onClose) {
      onClose();
    } else {
      navigate("/login");
    }
  };
  
  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setOpen(false);
    if (onClose) {
      onClose();
    } else {
      navigate("/login");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open || forcedOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md md:max-w-lg p-0 border-catalog-softBrown border-2 overflow-hidden rounded-lg"
        style={{
          background: "#FFFEF0", // Vintage white color
          boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        }}
      >
        <OnboardingStep
          title={onboardingSteps[currentStep].title}
          subtitle={onboardingSteps[currentStep].subtitle}
          description={onboardingSteps[currentStep].description}
          image={onboardingSteps[currentStep].image}
          backgroundColor={onboardingSteps[currentStep].backgroundColor}
          stepType={onboardingSteps[currentStep].stepType as "intro" | "bites" | "blockbusters" | "other"}
        />
        
        <div className="p-4 flex justify-between items-center border-t border-catalog-softBrown/30 bg-catalog-cream">
          {/* Skip button - only show if not on last step */}
          {currentStep < onboardingSteps.length - 1 ? (
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-catalog-softBrown hover:text-catalog-teal hover:bg-catalog-cream/50"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip
            </Button>
          ) : (
            <div></div> // Empty div to maintain spacing
          )}
          
          {/* Step indicators */}
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentStep === index 
                    ? 'bg-catalog-teal w-6' 
                    : 'bg-catalog-softBrown/40'
                }`}
              />
            ))}
          </div>
          
          {/* Next/Complete button */}
          <Button
            onClick={() => {
              if (currentStep < onboardingSteps.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                handleComplete();
              }
            }}
            className="bg-catalog-teal hover:bg-catalog-darkTeal text-white"
          >
            {currentStep < onboardingSteps.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingScreen;
