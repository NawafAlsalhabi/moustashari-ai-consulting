import { useParams, Link } from 'wouter';
import { useGetService, useAddToCart } from '@workspace/api-client-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Star, Clock, CheckCircle2, 
  ShoppingCart, ShieldCheck, HelpCircle, User 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const serviceId = parseInt(id || '0', 10);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: service, isLoading } = useGetService(serviceId, {
    query: {
      enabled: !!serviceId && !isNaN(serviceId),
    }
  });

  const addToCartMutation = useAddToCart();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add services to your cart.',
      });
      return;
    }
    
    try {
      await addToCartMutation.mutateAsync({ data: { serviceId } });
      toast({
        title: 'Added to cart',
        description: `${service?.title} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add item to cart.',
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!service) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Back to Services</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
          <Link href="/services" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs mb-4 uppercase tracking-wider">
                {service.categoryName}
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {service.description}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent fill-accent" />
                  <span className="font-bold text-lg">{service.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{service.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 relative items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-4">Overview</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>{service.longDescription || service.description}</p>
              </div>
            </section>

            <Separator />

            {/* Deliverables */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">What You'll Get</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-3 bg-card border border-border p-4 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <span className="font-medium text-foreground">{deliverable}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Consultant Info */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6">Your Consultant</h2>
              <div className="bg-card border border-border p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-primary/10 overflow-hidden shrink-0 border-4 border-background shadow-md">
                  {service.consultant.avatarUrl ? (
                    <img src={service.consultant.avatarUrl} alt={service.consultant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
                      {service.consultant.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
                    {service.consultant.name}
                    {service.consultant.verified && <ShieldCheck className="w-5 h-5 text-accent" />}
                  </h3>
                  <p className="text-primary font-medium mb-4">{service.consultant.title}</p>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {service.consultant.bio}
                  </p>
                  <Link href={`/consultants/${service.consultant.id}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">View Full Profile</Link>
                </div>
              </div>
            </section>

            <Separator />

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <section>
                <h2 className="font-serif text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {service.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              {service.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-muted">
                  <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="text-4xl font-bold text-primary mb-2">
                  ${service.price}
                </div>
                <p className="text-muted-foreground text-sm mb-6">Fixed price, no hidden fees.</p>
                
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 mb-4"
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                  {!addToCartMutation.isPending && <ShoppingCart className="ml-2 w-5 h-5" />}
                </Button>
                
                {!user && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    <Link href="/login" className="text-primary hover:underline">Log in</Link> to purchase this service.
                  </p>
                )}

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Satisfaction Guaranteed</h4>
                      <p className="text-xs text-muted-foreground mt-1">If deliverables aren't met, we'll refund you.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Quick Kickoff</h4>
                      <p className="text-xs text-muted-foreground mt-1">Consultation begins within 48 hours of purchase.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Dedicated Support</h4>
                      <p className="text-xs text-muted-foreground mt-1">24/7 access to your project manager.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
