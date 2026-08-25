import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  useListChatSessions, 
  useGetChatHistory, 
  useSendChatMessage,
  useGetRecommendations
} from '@workspace/api-client-react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Send, Sparkles, MessageSquare, PlusCircle, 
  Target, Briefcase, TrendingUp, ChevronRight
} from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const recommendationSchema = z.object({
  businessDescription: z.string().min(10, 'Please provide more detail'),
  goals: z.string().optional(),
});

type RecFormValues = z.infer<typeof recommendationSchema>;

export default function Chat() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q');

  const { user } = useAuth();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const { data: sessions, refetch: refetchSessions } = useListChatSessions({
    query: { enabled: !!user }
  });

  const { data: history, isLoading: isLoadingHistory, refetch: refetchHistory } = useGetChatHistory(activeSessionId || '', {
    query: { enabled: !!activeSessionId }
  });

  const sendMutation = useSendChatMessage();
  const recMutation = useGetRecommendations();

  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync server history to local state for optimistic updates
  useEffect(() => {
    if (history) {
      setLocalMessages(history);
    } else {
      setLocalMessages([]);
    }
  }, [history]);

  // Handle initial query from home page
  useEffect(() => {
    if (initialQuery && !activeSessionId && localMessages.length === 0 && !sendMutation.isPending) {
      handleSendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, sendMutation.isPending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || sendMutation.isPending) return;

    const userMessage = text.trim();
    setInputMessage('');
    
    // Optimistic user message
    setLocalMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage, createdAt: new Date().toISOString() }]);

    try {
      const response = await sendMutation.mutateAsync({
        data: {
          message: userMessage,
          sessionId: activeSessionId
        }
      });

      if (!activeSessionId && response.sessionId) {
        setActiveSessionId(response.sessionId);
        refetchSessions();
      }

      setLocalMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: response.reply, 
          suggestedServices: response.suggestedServices,
          createdAt: new Date().toISOString() 
        }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const recForm = useForm<RecFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: { businessDescription: '', goals: '' }
  });

  const onGetRecs = async (data: RecFormValues) => {
    try {
      const goalsArray = data.goals ? data.goals.split(',').map(s => s.trim()).filter(Boolean) : [];
      await recMutation.mutateAsync({
        data: {
          businessDescription: data.businessDescription,
          goals: goalsArray.length > 0 ? goalsArray : undefined,
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Sparkles className="w-16 h-16 text-accent mb-6" />
          <h1 className="font-serif text-3xl font-bold mb-4 text-foreground">AI Consulting Assistant</h1>
          <p className="text-muted-foreground max-w-[500px] mb-8">
            Log in to chat with our advanced AI, diagnose business challenges, and get tailored recommendations.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">Log in to Access</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideFooter>
      <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
        
        {/* Left Sidebar: Sessions */}
        <div className="w-72 border-r border-border bg-muted/30 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-border">
            <Button 
              className="w-full justify-start gap-2 bg-background hover:bg-primary/5 text-foreground border border-border"
              variant="outline"
              onClick={() => {
                setActiveSessionId(null);
                setLocalMessages([]);
              }}
            >
              <PlusCircle className="w-4 h-4" />
              New Consultation
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2 mt-2">Recent Sessions</div>
              {sessions?.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-3",
                    activeSessionId === session.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
              ))}
              {(!sessions || sessions.length === 0) && (
                <div className="text-sm text-muted-foreground px-2 py-4">No past sessions.</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-8" ref={scrollRef}>
            {localMessages.length === 0 && !sendMutation.isPending && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-2xl font-bold mb-3">How can I help your business today?</h2>
                <p className="text-muted-foreground mb-8">
                  Describe a challenge you're facing, a goal you want to achieve, or ask for an analysis of your current strategy.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 w-full">
                  <button onClick={() => handleSendMessage("Help me identify bottlenecks in my supply chain")} className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground">
                    "Help me identify bottlenecks in my supply chain"
                  </button>
                  <button onClick={() => handleSendMessage("What's the best way to enter the Saudi market?")} className="text-left p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground">
                    "What's the best way to enter the Saudi market?"
                  </button>
                </div>
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-8 pb-4">
              {localMessages.map((msg, idx) => (
                <div key={msg.id || idx} className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}>
                  <div className={cn(
                    "w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1",
                    msg.role === 'user' 
                      ? "bg-primary text-primary-foreground font-bold text-xs" 
                      : "bg-accent/20 text-accent"
                  )}>
                    {msg.role === 'user' ? user?.name.charAt(0) : <Sparkles className="w-4 h-4" />}
                  </div>
                  
                  <div className={cn(
                    "space-y-4",
                    msg.role === 'user' ? "items-end text-right" : "items-start text-left"
                  )}>
                    <div className={cn(
                      "px-5 py-3.5 rounded-2xl text-sm md:text-base leading-relaxed whitespace-pre-wrap shadow-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>

                    {/* Suggested Services attached to assistant message */}
                    {msg.suggestedServices && msg.suggestedServices.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> Recommended Services
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {msg.suggestedServices.map((service: any) => (
                            <Link key={service.id} href={`/services/${service.id}`}>
                              <div className="group bg-card border border-border p-3 rounded-xl hover:border-primary/50 transition-colors text-left flex flex-col h-full cursor-pointer hover-elevate">
                                <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{service.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">{service.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                                  <span className="font-bold text-primary text-sm">${service.price}</span>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {sendMutation.isPending && (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 bg-accent/20 text-accent">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-card border border-border rounded-tl-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-background border-t border-border/50">
            <div className="max-w-3xl mx-auto relative flex items-end">
              <Textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }
                }}
                placeholder="Ask follow-up questions..."
                className="min-h-[60px] max-h-32 resize-none pr-14 py-4 rounded-2xl bg-card border-border/60 focus-visible:ring-primary shadow-sm"
              />
              <Button 
                size="icon" 
                className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || sendMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Assessment */}
        <div className="w-80 border-l border-border bg-card hidden lg:flex flex-col">
          <div className="p-5 border-b border-border">
            <h3 className="font-serif font-bold text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Deep Diagnosis
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Provide context for highly tailored service recommendations.
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-5 space-y-6">
              <Form {...recForm}>
                <form onSubmit={recForm.handleSubmit(onGetRecs)} className="space-y-4">
                  <FormField
                    control={recForm.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Situation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your business model, current scale, and primary challenges..." 
                            className="h-28 text-sm resize-none bg-background"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={recForm.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Goals</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. increase margins, enter new market (comma separated)" 
                            className="text-sm bg-background"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-sm" disabled={recMutation.isPending}>
                    {recMutation.isPending ? 'Analyzing...' : 'Generate Recommendations'}
                  </Button>
                </form>
              </Form>

              {recMutation.isSuccess && recMutation.data && (
                <div className="mt-8 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="font-bold text-sm mb-3">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed bg-muted/50 p-3 rounded-lg border border-border/50">
                    {recMutation.data.explanation}
                  </p>
                  
                  <h4 className="font-bold text-sm mb-3">Recommended Packages</h4>
                  <div className="space-y-3">
                    {recMutation.data.services.map(service => (
                      <Link key={service.id} href={`/services/${service.id}`}>
                        <div className="bg-background border border-border p-3 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                          <h5 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{service.title}</h5>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">{service.consultantName}</span>
                            <span className="font-bold text-primary text-sm">${service.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

      </div>
    </AppLayout>
  );
}
