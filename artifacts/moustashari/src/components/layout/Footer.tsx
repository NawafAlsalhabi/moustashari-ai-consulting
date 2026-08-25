import { Link } from 'wouter';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 inline-flex">
              <div className="w-10 h-10 rounded bg-accent flex items-center justify-center text-accent-foreground font-serif font-bold text-2xl">
                M
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">
                Moustashari
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6 pr-4">
              The premier AI-powered business consulting platform for entrepreneurs and SMEs in the Middle East and globally.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif font-bold text-lg mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Browse Services</Link></li>
              <li><Link href="/consultants" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Our Consultants</Link></li>
              <li><Link href="/chat" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm flex items-center gap-2">AI Assistant <span className="bg-accent/20 text-accent text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span></Link></li>
              <li><Link href="/how-it-works" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">How it Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Careers</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Contact</Link></li>
              <li><Link href="/become-consultant" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">Join as Consultant</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Dubai International Financial Centre (DIFC)<br />Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+971 4 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>hello@moustashari.ai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} Moustashari AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-primary-foreground/50 hover:text-primary-foreground text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-primary-foreground/50 hover:text-primary-foreground text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
