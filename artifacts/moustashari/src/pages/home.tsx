import { useState } from 'react';
import { Link } from 'wouter';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  useGetPlatformStats, 
  useListFeaturedServices, 
  useListConsultants,
  useListCategories 
} from '@workspace/api-client-react';
import { 
  ArrowRight, Sparkles, TrendingUp, Users, ShieldCheck, 
  Star, ChevronRight, MessageSquare, Briefcase, BookOpen 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [chatInput, setChatInput] = useState('');
  
  const { data: stats } = useGetPlatformStats();
  const { data: featuredServices, isLoading: isLoadingServices } = useListFeaturedServices();
  const { data: topConsultants, isLoading: isLoadingConsultants } = useListConsultants({ query: { search: null } });
  const { data: categories } = useListCategories();

  // Safely take top 3 consultants
  const featuredConsultants = topConsultants?.slice(0, 3) || [];

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 overflow-hidden">
        {/* Subtle noise/texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-primary-foreground/5 blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/4" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-accent font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Agentic AI Meets Human Expertise</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary-foreground tracking-tight leading-[1.1] mb-6">
              Your World-Class <br/>
              <span className="text-accent italic font-light">Business Consultant</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto mb-10">
              Moustashari combines elite AI analysis with proven human experts to solve your toughest business challenges, scale your operations, and drive growth.
            </p>

            {/* Hero AI Search/Chat */}
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-2 shadow-2xl flex items-center gap-2 border border-border/50">
              <div className="pl-4 text-muted-foreground flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <Input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="What business challenge are you facing today?" 
                className="border-0 shadow-none focus-visible:ring-0 text-lg h-14 bg-transparent text-foreground placeholder:text-muted-foreground/70"
              />
              <Link href={`/chat${chatInput ? `?q=${encodeURIComponent(chatInput)}` : ''}`} className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold group shrink-0">
                  Ask AI
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-primary-foreground/60">
              <span>Try:</span>
              <button onClick={() => setChatInput("How can I improve my retail margins?")} className="px-3 py-1 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">Improve retail margins</button>
              <button onClick={() => setChatInput("I need a go-to-market strategy for UAE")} className="px-3 py-1 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">UAE go-to-market</button>
            </div>
          </div>
        </div>

        {/* Stats Strip - Positioned absolute to overlap the section border */}
        <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 z-20 container mx-auto px-4 md:px-6 hidden md:block">
          <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-8 grid grid-cols-4 divide-x divide-border">
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-primary mb-1">{stats?.totalClients || '500+'}</div>
              <div className="text-sm font-medium text-muted-foreground">Active Businesses</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-primary mb-1">{stats?.totalConsultants || '50+'}</div>
              <div className="text-sm font-medium text-muted-foreground">Expert Consultants</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-bold text-primary mb-1">{stats?.totalServices || '120+'}</div>
              <div className="text-sm font-medium text-muted-foreground">Ready-to-deploy Services</div>
            </div>
            <div className="text-center px-4 flex items-center justify-center flex-col">
              <div className="flex items-center gap-1 text-3xl font-bold text-primary mb-1">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '4.9'}
                <Star className="w-6 h-6 fill-accent text-accent mb-1" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* spacer for overlapping stats */}
      <div className="h-16 md:h-32 bg-background"></div>

      {/* Featured Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Strategic Solutions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Pre-packaged consulting engagements designed for immediate impact and measurable ROI.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 group">
                View All Services
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoadingServices ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices?.slice(0, 3).map((service) => (
                <Link key={service.id} href={`/services/${service.id}`}>
                  <div className="group h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate">
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      {service.imageUrl ? (
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20">
                          <Briefcase className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-primary">
                        {service.categoryName}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden">
                            {service.consultantAvatarUrl ? (
                              <img src={service.consultantAvatarUrl} alt={service.consultantName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                                {service.consultantName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground">{service.consultantName}</span>
                        </div>
                        <div className="font-bold text-lg text-primary">
                          ${service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works / The Moustashari Advantage */}
      <section className="py-20 md:py-32 bg-muted relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">The Moustashari Advantage</h2>
            <p className="text-muted-foreground text-lg">
              We've reinvented business consulting to be faster, more affordable, and relentlessly focused on results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground mb-6 shadow-lg shadow-primary/20 rotate-[-3deg]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">AI-Powered Diagnosis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chat with our advanced AI assistant to instantly diagnose your business challenges and get tailored service recommendations.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground mb-6 shadow-lg shadow-accent/20 rotate-[3deg]">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Vetted Human Experts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work directly with top-tier consultants who have proven track records in the Middle East and global markets.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center text-background mb-6 shadow-lg shadow-foreground/10">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Guaranteed Outcomes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every service comes with clearly defined deliverables and timelines. No vague promises, just actionable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Consultants */}
      <section className="py-20 md:py-32 bg-background border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Elite Consultants</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Partner with seasoned professionals who understand your market and have scaled businesses like yours.
              </p>
            </div>
            <Link href="/consultants" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 group">
                View All Consultants
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingConsultants ? (
               [1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 p-6 border rounded-2xl">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              ))
            ) : (
              featuredConsultants.map((consultant) => (
                <Link key={consultant.id} href={`/consultants/${consultant.id}`}>
                  <div className="bg-card border border-border p-6 rounded-2xl hover:shadow-lg transition-all hover-elevate flex flex-col h-full">
                    <div className="flex items-start gap-5 mb-4">
                      <div className="w-20 h-20 rounded-full bg-primary/10 overflow-hidden shrink-0 border-2 border-background shadow-sm">
                        {consultant.avatarUrl ? (
                          <img src={consultant.avatarUrl} alt={consultant.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">
                            {consultant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {consultant.name}
                          {consultant.verified && <ShieldCheck className="w-4 h-4 text-accent" />}
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium">{consultant.title}</p>
                        <div className="flex items-center gap-1 mt-2 text-sm">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-bold">{consultant.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({consultant.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {consultant.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {consultant.specializations.slice(0, 3).map((spec, i) => (
                        <span key={i} className="bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-md font-medium">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm font-medium">
                      <div className="text-muted-foreground">{consultant.yearsExperience} yrs exp.</div>
                      <div className="text-primary flex items-center group-hover:text-accent transition-colors">
                        View Profile <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to scale your business?
          </h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10">
            Join hundreds of entrepreneurs who are already leveraging Moustashari's AI and human expertise to drive growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto h-14 px-8 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started for Free
            </Link>
            <Link href="/chat" className="inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border w-full sm:w-auto h-14 px-8 text-base font-medium bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10">
                Talk to AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
