import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Briefcase, Building, ChevronRight, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRegister } from '@workspace/api-client-react';

import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  company: z.string().optional(),
  industry: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth(); // We'll just login manually or redirect to login after reg
  const { toast } = useToast();
  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      company: '',
      industry: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const result = await registerMutation.mutateAsync({ data });
      if (result.token) {
        localStorage.setItem('moustashari_token', result.token);
        // Usually, we'd also want to refresh the user context, but reloading works
        window.location.href = '/'; 
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'Please check your details and try again.',
      });
    }
  };

  return (
    <AppLayout hideFooter>
      <div className="flex-1 flex min-h-0 bg-background">
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="text-center space-y-2">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
              <p className="text-muted-foreground text-sm">
                Join Moustashari to access world-class AI and human business consulting.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="John Doe" className="pl-9 h-11" {...field} />
                        </div>
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="john@company.com" className="pl-9 h-11" {...field} />
                        </div>
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
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-9 h-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Acme Inc" className="pl-9 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. Retail" className="pl-9 h-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium group mt-2" 
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                  {!registerMutation.isPending && (
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors">
                Log in
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right side visual */}
        <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden items-center justify-center p-12">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
               style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
          </div>
          
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-lg text-primary-foreground">
            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center text-accent font-serif font-bold text-3xl mb-8 backdrop-blur-sm border border-accent/20">
              M
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight mb-6">
              "The clarity we gained in just one week would have taken us months to figure out alone."
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 border border-primary-foreground/10 flex items-center justify-center font-bold">
                SA
              </div>
              <div>
                <p className="font-bold">Sarah Al-Fayed</p>
                <p className="text-primary-foreground/60 text-sm">Founder, Nexus Tech</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
