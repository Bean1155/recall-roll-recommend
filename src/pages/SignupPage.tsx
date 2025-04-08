
import React from "react";
import GridLayout from "@/components/GridLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

const SignupPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    login(data.email);
    navigate("/");
  };

  return (
    <GridLayout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md border-catalog-softBrown shadow-lg">
          <CardHeader className="bg-catalog-cream border-b border-catalog-softBrown">
            <CardTitle className="text-center text-2xl font-typewriter">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Start building your personal catalog
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="border-catalog-softBrown" 
                          placeholder="Your Name" 
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="border-catalog-softBrown" 
                          placeholder="youremail@example.com" 
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
                        <Input 
                          {...field} 
                          type="password" 
                          className="border-catalog-softBrown" 
                          placeholder="••••••••" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-catalog-teal hover:bg-catalog-darkTeal"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate("/login")}
                className="text-catalog-teal hover:text-catalog-darkTeal"
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </GridLayout>
  );
};

export default SignupPage;
