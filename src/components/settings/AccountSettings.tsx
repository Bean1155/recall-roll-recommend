
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const accountFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const AccountSettings = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof accountFormSchema>) => {
    // In a real app, this would connect to an auth service
    console.log("Account data submitted:", data);
    setIsRegistered(true);
    toast({
      title: "Account created",
      description: "Your account has been successfully created!",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-catalog-teal">Account Settings</h2>
      
      {!isRegistered ? (
        <div className="space-y-4">
          <p className="text-catalog-softBrown text-sm">
            Create an account to save your catalog and access it from any device.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="catalog-input" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a secure password" 
                          className="catalog-input pr-10" 
                          {...field} 
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          className="absolute right-0 top-0 h-full px-3 py-0" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm your password" 
                          className="catalog-input pr-10" 
                          {...field} 
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          className="absolute right-0 top-0 h-full px-3 py-0" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-catalog-teal hover:bg-catalog-darkTeal"
              >
                Create Account
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Email Address</Label>
            <Input 
              id="current-email" 
              value="user@example.com" 
              readOnly 
              className="catalog-input bg-gray-50" 
            />
          </div>
          
          <div className="flex justify-between items-center py-2 border-t border-b border-gray-100">
            <span className="text-sm font-medium">Change Password</span>
            <Button variant="outline" size="sm">Update Password</Button>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="text-sm font-medium">Delete Account</span>
              <p className="text-xs text-muted-foreground">
                This will permanently delete your account and all your data.
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
