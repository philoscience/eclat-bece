import { useState } from "react";
import { HelpCircle, BookOpen, FileText, Mail, Phone, MessageSquare, Loader2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function ParentResourcesPage() {
  const { user } = useAuth();
  const [supportMessage, setSupportMessage] = useState("");
  const [sendingSupport, setSendingSupport] = useState(false);

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    if (!user) {
      toast.error("You must be logged in to send a support request.");
      return;
    }
    setSendingSupport(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-support-email", {
        body: {
          user_id: user.id,
          message: supportMessage.trim(),
        },
      });

      if (error) throw error;
      
      toast.success("Support request sent! We will contact you via email shortly.");
      setSupportMessage("");
    } catch (error: any) {
      console.error("Error sending support email:", error);
      toast.error(error.message || "Failed to send support request. Please try again.");
    } finally {
      setSendingSupport(false);
    }
  };

  return (
    <div className="p-6 space-y-10 animate-fade-in max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
          <HelpCircle className="h-4 w-4" />
          <span>Help & Resources</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Portal <span className="text-primary italic">Resources</span>.
        </h1>
        <p className="text-muted-foreground font-medium">
          Access exam guidelines, study handbooks, and directly contact our support desk for help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h4>
            <p className="text-muted-foreground text-sm font-medium">Quick answers to common questions about managing your student's account.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border-2 border-border/40 bg-background/50 rounded-2xl px-5 py-1">
              <AccordionTrigger className="hover:no-underline font-bold text-base text-foreground text-left py-4">
                How do my children connect to my parent portal?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-sm leading-relaxed pb-4">
                Every parent account has a unique 8-character connection code. You can find this under <strong className="text-primary">Settings &gt; Children &amp; Preferences</strong>. Share this code with your children, and they can enter it in their profile settings or during signup to link their accounts automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-2 border-border/40 bg-background/50 rounded-2xl px-5 py-1">
              <AccordionTrigger className="hover:no-underline font-bold text-base text-foreground text-left py-4">
                What features are included in the Premium subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-sm leading-relaxed pb-4">
                Premium unlocks unlimited practice questions, full access to all subjects (including comprehension passages), detailed performance graphs, class leaderboards, and priority support. Standard accounts are limited to basic subject coverage and 50 practice questions per session.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-2 border-border/40 bg-background/50 rounded-2xl px-5 py-1">
              <AccordionTrigger className="hover:no-underline font-bold text-base text-foreground text-left py-4">
                How can I assign a custom practice task to my child?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-sm leading-relaxed pb-4">
                On the dashboard, locate your child's overview card. Click the <strong className="text-primary">Assign Task</strong> button, choose the subject and specific topics, set the number of questions, and click assign. Your child will instantly see the new task on their student dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-2 border-border/40 bg-background/50 rounded-2xl px-5 py-1">
              <AccordionTrigger className="hover:no-underline font-bold text-base text-foreground text-left py-4">
                How does the streak tracking work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-medium text-sm leading-relaxed pb-4">
                The daily streak tracks the consecutive days your child completes at least one practice quiz. High streaks build study habits and are celebrated with special badges on both student and parent dashboards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right Column: Handbooks & Contact Support */}
        <div className="lg:col-span-5 space-y-8">
          {/* Quick Handbooks */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xl font-bold tracking-tight text-foreground">Guides & Syllabi</h4>
              <p className="text-muted-foreground text-sm font-medium">Study resources to help your child prepare for the BECE exams.</p>
            </div>
            <div className="space-y-3">
              <a
                href="https://www.neco.gov.ng/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 border-2 border-border/40 bg-background/50 hover:border-primary/30 rounded-2xl transition-all group"
              >
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">Official NECO BECE Syllabus Guidelines</p>
                  <p className="text-xs text-muted-foreground font-medium">Review the official requirements and subject curriculum.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://www.neco.gov.ng/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 border-2 border-border/40 bg-background/50 hover:border-primary/30 rounded-2xl transition-all group"
              >
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">Parent's Study Companion Handbook</p>
                  <p className="text-xs text-muted-foreground font-medium">Best practices on structuring study time and rewards at home.</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Contact Form */}
          <Card className="rounded-[2rem] border-2 border-border/60 overflow-hidden shadow-sm bg-background/30 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Direct Support Message
              </CardTitle>
              <CardDescription className="font-medium text-xs">
                Need custom help or found an issue? Send us a direct message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSendSupport} className="space-y-3">
                <Textarea
                  placeholder="Describe your issue or question..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="min-h-[90px] rounded-xl border-2 font-medium bg-background"
                  required
                />
                <Button
                  type="submit"
                  disabled={sendingSupport || !supportMessage.trim()}
                  className="w-full rounded-xl font-bold h-10"
                  size="sm"
                >
                  {sendingSupport ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-around pt-2 border-t border-border/40 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> support@eclatapp.xyz</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +2348130202112</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
