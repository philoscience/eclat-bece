import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <Card className="max-w-2xl w-full text-center border-2 border-primary/20 shadow-soft">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-full flex items-center justify-center">
            <Construction size={40} className="text-primary" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This page is still under development. We're working hard to create a comprehensive privacy policy for you.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
