import { useState } from 'react';
import { Link } from 'wouter';
import { useListConsultants, useListCategories } from '@workspace/api-client-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, Star, ChevronRight, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Consultants() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  
  const { data: categories } = useListCategories();
  
  const parsedCategoryId = categoryId === 'all' ? undefined : parseInt(categoryId, 10);
  const parsedSearch = search.trim() === '' ? undefined : search;

  const { data: consultants, isLoading } = useListConsultants({
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
              Our Expert Consultants
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              World-class professionals with proven track records. Ready to help you scale, optimize, and transform your business.
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
              placeholder="Search by name, expertise, or background..." 
              className="pl-10 h-12 bg-background border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-[250px] flex gap-2">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 bg-background border-border">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
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
              <div key={i} className="flex gap-4 p-6 border rounded-2xl bg-card">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : consultants && consultants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {consultants.map((consultant) => (
              <Link key={consultant.id} href={`/consultants/${consultant.id}`}>
                <div className="bg-card border border-border p-6 rounded-2xl hover:shadow-lg transition-all hover-elevate flex flex-col h-full group">
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
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-2xl border border-border border-dashed">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No consultants found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any consultants matching your search criteria. Try adjusting your filters.
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
