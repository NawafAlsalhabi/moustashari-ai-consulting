import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-8">
          <FileQuestion className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-serif text-4xl font-bold tracking-tight mb-4 text-foreground">
          Page Not Found
        </h1>
        <p className="text-muted-foreground max-w-[500px] mb-8 text-lg">
          The page you are looking for doesn't exist or has been moved. 
          Let's get you back on track to building your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full sm:w-auto">
              Return Home
          </Link>
          <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8 w-full sm:w-auto">
              Browse Services
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
