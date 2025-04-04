
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

interface LaunchScreenProps {
  forcedOpen?: boolean;
  onClose?: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ forcedOpen = false, onClose }) => {
  const [open, setOpen] = useState(true);
  const [stamped, setStamped] = useState(false);
  const { setCurrentUser } = useUser();
  const [displayText, setDisplayText] = useState("");
  const fullText = "TOTAL RECALL CATALOG";

  // Reset stamped state when forcedOpen changes
  useEffect(() => {
    if (forcedOpen) {
      setOpen(true);
      setStamped(false);
      setDisplayText("");
      
      const timer = setTimeout(() => {
        setStamped(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [forcedOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Animation sequence for the stamp effect
  useEffect(() => {
    if (open && !stamped) {
      const timer = setTimeout(() => {
        setStamped(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [open, stamped]);

  // Typewriter effect for the title
  useEffect(() => {
    if (stamped && displayText.length < fullText.length) {
      const typeTimer = setTimeout(() => {
        setDisplayText(fullText.substring(0, displayText.length + 1));
      }, 100);
      
      return () => clearTimeout(typeTimer);
    }
  }, [stamped, displayText]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create a new user with the form data
    const newUser = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      avatar: "",
      createdAt: new Date().toISOString(),
    };
    
    // Set the current user in context
    setCurrentUser(newUser);
    
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    
    // Mark that the user has seen the launch screen
    localStorage.setItem("hasSeenLaunch", "true");
    
    // Show success toast
    toast({
      title: "Welcome to Total Recall Catalog!",
      description: "Your account has been created successfully.",
      className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium",
    });
    
    // Close the launch screen
    setOpen(false);
    
    // Call onClose if provided
    if (onClose) {
      onClose();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  // Don't render anything if not open and not forcibly opened
  if (!open && !forcedOpen) return null;

  return (
    <Dialog open={open || forcedOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl p-0 border-catalog-softBrown border-2 overflow-hidden retro-striped-bg">
        <div className="flex flex-col items-center justify-center p-6">
          <div 
            className={`relative flex flex-col items-center justify-center mb-4 transition-all duration-1000 transform ${stamped ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}
          >
            {/* Logo Container */}
            <div 
              className={`relative flex items-center justify-center mb-8 transition-all duration-500 ${stamped ? 'rotate-0' : 'rotate-45'}`}
            >
              <div className="absolute inset-0 rounded-md opacity-20 shadow-xl"></div>
              
              {/* Logo Image - improved background removal */}
              <div className="relative w-40 h-40 mb-3 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/051572e4-ca2a-4eef-81be-0463d9c5ec0a.png" 
                  alt="Total Recall Catalog Logo" 
                  className="w-full h-full object-contain"
                  style={{ 
                    mixBlendMode: 'multiply',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              </div>
            </div>
            
            {/* Typed Content */}
            <div 
              className={`text-center transform transition-all duration-700 ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{
                fontFamily: "'American Typewriter', 'Courier New', monospace",
              }}
            >
              <h1 className="text-4xl font-bold mb-2 font-typewriter"
                style={{
                  textShadow: "1px 1px 0px rgba(50, 50, 93, 0.25)",
                  color: "#000000", // Changed from #AA3333 to black
                  minHeight: "48px", // Ensure height doesn't jump during animation
                }}>
                {displayText}
                <span className={`inline-block ${displayText.length < fullText.length ? 'animate-pulse' : 'opacity-0'}`}>|</span>
              </h1>
              <p className="text-xl text-vintage-red font-typewriter mb-4">
                Tracking Every Bite and Blockbuster
              </p>
            </div>
          </div>

          {/* Form emerges after stamp animation */}
          <div 
            className={`w-full mt-6 transition-all duration-500 transform ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-vintage-red font-medium">This Catalog belongs to</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          className="bg-white border-catalog-softBrown" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-vintage-red font-medium">Correspondence</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="bg-white border-catalog-softBrown" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-catalog-teal hover:bg-catalog-darkTeal text-white font-medium"
                  >
                    Get Started
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm text-vintage-red">
              <p>Start tracking your favorites and sharing recommendations!</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchScreen;
