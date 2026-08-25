import { useState } from 'react';
import { Link } from 'wouter';
import { useListServices, useListCategories } from '@workspace/api-client-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Briefcase, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Services() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  
  const { data: categories } = useListCategories();
  
  // Convert 'all' to undefined for API
  const parsedCategoryId = categoryId === 'all' ? undefined : parseInt(categoryId, 10);
  const parsedSearch = search.trim() === '' ? undefined : search;

  const { data: services, isLoading } = useListServices({
    query: {
      categoryId: parsedCategoryId,
      search: parsedSearch,
    }
  });

  return (
    <AppLayout>
      <div className="bg-primary pt-16 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Strategic Services
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Discover proven, fixed-price consulting packages designed to deliver immediate ROI and solve your most pressing business challenges.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-20 pb-24">
        {/* Filters */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-4 mb-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search services, e.g., Financial Modeling..." 
              className="pl-10 h-12 bg-background border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-[250px] flex gap-2">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 bg-background border-border">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col gap-4 bg-card p-4 rounded-2xl border border-border">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <div className="group h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover-elevate flex flex-col">
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
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {service.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
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
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground leading-none">{service.consultantName}</span>
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-muted-foreground">{service.duration}</div>
                        <div className="font-bold text-lg text-primary">${service.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any services matching your search criteria. Try adjusting your filters.
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => {
                setSearch('');
                setCategoryId('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
