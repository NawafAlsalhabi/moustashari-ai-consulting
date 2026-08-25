import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetCart, useRemoveFromCart } from '@workspace/api-client-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, Trash2, ArrowRight, ShieldCheck, 
  CreditCard, ArrowLeft, Clock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Cart() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: cart, isLoading } = useGetCart({
    query: {
      enabled: !!user,
    }
  });

  const removeMutation = useRemoveFromCart();

  const handleRemove = async (itemId: number) => {
    try {
      await removeMutation.mutateAsync({ itemId });
      toast({
        title: 'Item removed',
        description: 'Service has been removed from your cart.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove item.',
      });
    }
  };

  const handleCheckout = () => {
    toast({
      title: 'Checkout initiated',
      description: 'In a real app, this would redirect to a payment gateway like Stripe.',
    });
    // Optional: fake a clear cart or redirect to a success page
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center py-24">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4 text-foreground">Authentication Required</h1>
          <p className="text-muted-foreground max-w-[500px] mb-8">
            Please log in to view your cart and proceed to checkout.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">Log in</Link>
            <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8">Create Account</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <h1 className="font-serif text-3xl font-bold mb-8">Your Cart</h1>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center py-32 bg-muted/30">
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-4 text-foreground">Your cart is empty</h1>
          <p className="text-muted-foreground max-w-[500px] mb-8 text-lg">
            You haven't added any consulting services to your cart yet.
          </p>
          <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base">
              Browse Services
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-primary/5 border-b border-border py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-foreground">Review Items</h2>
              <span className="text-sm font-medium text-muted-foreground">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</span>
            </div>
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-card border border-border p-5 rounded-2xl relative group">
                  <div className="w-full sm:w-32 h-24 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link href={`/services/${item.serviceId}`}>
                          <h3 className="font-serif text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer pr-8">
                            {item.title}
                          </h3>
                        </Link>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-2 -m-2 sm:absolute sm:top-5 sm:right-5 rounded-full hover:bg-destructive/10"
                          title="Remove item"
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1 mb-4 flex items-center gap-2">
                        Consultant: <span className="font-medium text-foreground">{item.consultantName}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {item.duration}
                      </div>
                      <div className="font-bold text-xl text-primary">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
              <Link href="/services" className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Add more services
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cart.total}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${cart.total}</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 px-4 bg-muted/50">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Secure, encrypted payment</span>
                </div>
                <p className="text-center text-xs px-4">
                  By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
