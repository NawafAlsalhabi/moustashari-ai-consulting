import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/context/AuthContext';

import Home from '@/pages/home';
import Services from '@/pages/services';
import ServiceDetail from '@/pages/services/detail';
import Consultants from '@/pages/consultants';
import ConsultantDetail from '@/pages/consultants/detail';
import Chat from '@/pages/chat';
import Cart from '@/pages/cart';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:id" component={ServiceDetail} />
      <Route path="/consultants" component={Consultants} />
      <Route path="/consultants/:id" component={ConsultantDetail} />
      <Route path="/chat" component={Chat} />
      <Route path="/cart" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
