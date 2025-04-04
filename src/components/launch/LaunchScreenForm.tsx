
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

interface LaunchScreenFormProps {
  stamped: boolean;
  onSubmitSuccess: () => void;
}

const LaunchScreenForm: React.FC<LaunchScreenFormProps> = ({ 
  stamped, 
  onSubmitSuccess 
}) => {
  const { setCurrentUser } = useUser();

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
      description: "Your account has been created successfully.",
      className: "bg-catalog-cream border-catalog-teal border-4 text-catalog-darkBrown font-medium",
    });
    
    // Call the onSubmitSuccess callback
    onSubmitSuccess();
  };

  return (
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
  );
};

export default LaunchScreenForm;
