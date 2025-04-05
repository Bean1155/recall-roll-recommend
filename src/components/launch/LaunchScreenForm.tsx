
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

interface LaunchScreenFormProps {
  stamped: boolean;
  onSubmitSuccess: () => void;
}

const LaunchScreenForm: React.FC<LaunchScreenFormProps> = ({ 
  stamped, 
  onSubmitSuccess 
}) => {
  const { setCurrentUser } = useUser();
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

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
      description: "Your account has been created. Please complete your profile setup.",
      className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium",
    });
    
    // Call the onSubmitSuccess callback
    onSubmitSuccess();
    
    // Navigate to settings page with account tab active
    navigate("/settings?tab=account");
  };

  return (
    <div 
      className={`w-full max-w-md transition-all duration-500 transform ${stamped ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
    >
      {/* Library card appearance */}
      <div 
        className="bg-white border border-gray-300 rounded-md shadow-md overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(220,252,231,0.1) 0%, rgba(255,255,255,1) 3%, rgba(255,255,255,1) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 27px, #a9d9d0 27px, #a9d9d0 28px),
            repeating-linear-gradient(90deg, transparent, transparent 120px, #a9d9d0 120px, #a9d9d0 121px)
          `,
        }}
      >
        <div className="border-b border-gray-300 bg-gray-100 px-4 py-2 flex justify-between items-center">
          <div className="text-xs font-bold text-gray-500">CATALOG CARD</div>
          <div className="text-xs font-bold text-gray-500">DATE ISSUED: {formattedDate}</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex flex-col sm:flex-row items-start">
                    <FormLabel className="text-vintage-red font-mono font-bold text-sm sm:min-w-[100px] mt-2">BORROWER:</FormLabel>
                    <div className="flex-1 w-full mt-1 sm:mt-0">
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
                          className="border-0 border-b border-dashed border-catalog-softBrown focus:border-catalog-teal rounded-none pl-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="flex flex-col sm:flex-row items-start">
                    <FormLabel className="text-vintage-red font-mono font-bold text-sm sm:min-w-[100px] mt-2">CORRESPONDENCE:</FormLabel>
                    <div className="flex-1 w-full mt-1 sm:mt-0">
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="border-0 border-b border-dashed border-catalog-softBrown focus:border-catalog-teal rounded-none pl-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-center mt-4 mb-2">
              <Button 
                type="submit" 
                className="w-3/4 bg-catalog-teal hover:bg-catalog-darkTeal text-white font-medium"
              >
                Checkout
              </Button>
            </div>
            
            <div className="text-center text-xs sm:text-sm text-vintage-red mt-2">
              <p>Catalog, share, and checkout your favorites.</p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LaunchScreenForm;
