import { useParams, Link } from 'wouter';
import { useGetConsultant } from '@workspace/api-client-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, Star, ShieldCheck, Briefcase, 
  MapPin, GraduationCap, Languages, ChevronRight 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ConsultantDetail() {
  const { id } = useParams<{ id: string }>();
  const consultantId = parseInt(id || '0', 10);

  const { data: consultant, isLoading } = useGetConsultant(consultantId, {
    query: {
      enabled: !!consultantId && !isNaN(consultantId),
    }
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-24 mb-8" />
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!consultant) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Consultant not found</h1>
          <Link href="/consultants" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Back to Consultants</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-primary text-primary-foreground pt-12 pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/consultants" className="inline-flex items-center text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Consultants
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-24 relative z-10 pb-24">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Profile Card */}
          <div className="bg-card rounded-2xl border border-border shadow-xl p-8 lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-primary/10 overflow-hidden mb-6 border-4 border-background shadow-md">
                {consultant.avatarUrl ? (
                  <img src={consultant.avatarUrl} alt={consultant.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-5xl">
                    {consultant.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <h1 className="font-serif text-3xl font-bold text-foreground flex items-center justify-center gap-2 mb-2">
                {consultant.name}
                {consultant.verified && <ShieldCheck className="w-6 h-6 text-accent" />}
              </h1>
              
              <p className="text-lg text-primary font-medium mb-4">{consultant.title}</p>
              
              <div className="flex items-center justify-center gap-2 mb-6 text-foreground">
                <Star className="w-5 h-5 text-accent fill-accent" />
                <span className="font-bold text-xl">{consultant.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({consultant.reviewCount} reviews)</span>
              </div>

              <div className="w-full space-y-4 pt-6 border-t border-border text-left">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{consultant.yearsExperience} Years Experience</span>
                </div>
                {consultant.languages && consultant.languages.length > 0 && (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Languages className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{consultant.languages.join(', ')}</span>
                  </div>
                )}
                {consultant.education && consultant.education.length > 0 && (
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{consultant.education[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About */}
            <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">About {consultant.name.split(' ')[0]}</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p>{consultant.longBio || consultant.bio}</p>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {consultant.specializations.map((spec, index) => (
                    <span key={index} className="bg-primary/5 text-primary border border-primary/10 px-4 py-2 rounded-full font-medium text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Offered Services */}
            <section>
              <h2 className="font-serif text-2xl font-bold mb-6 flex items-center justify-between">
                <span>Offered Services</span>
                <span className="text-sm font-sans font-normal text-muted-foreground">{consultant.services?.length || 0} available</span>
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {consultant.services?.map(service => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <div className="group bg-card border border-border p-6 rounded-xl hover:border-primary/50 hover:shadow-md transition-all h-full flex flex-col">
                      <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                        {service.categoryName}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
                        <div className="font-bold text-lg text-primary">${service.price}</div>
                        <div className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {(!consultant.services || consultant.services.length === 0) && (
                  <div className="col-span-full p-8 text-center text-muted-foreground bg-muted rounded-xl border border-dashed border-border">
                    This consultant currently has no active services listed.
                  </div>
                )}
              </div>
            </section>

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
