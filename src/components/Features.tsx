import { BookOpen, Trophy, BarChart3, CheckCircle2, Target, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Empower Parents to Create Personalized Practice",
      description: "Create custom Mathematics, English, Basic Science, and Social Studies quizzes tailored to your child's learning needs. Set questions, choose difficulty levels, and track progress from one place.",
      color: "text-primary",
      bgColor: "bg-primary-light",
      onClick: () => navigate("/dashboard/parent"),
    },
    {
      icon: BarChart3,
      title: "Detailed Performance Analytics",
      description: "Track your ward's progress with in-depth analytics. Parents can monitor performance in real-time.",
      color: "text-primary-glow",
      bgColor: "bg-primary-light",
      onClick: () => navigate("/dashboard/parent"),
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make learning engaging, competitive, and rewarding.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`border-2 hover:border-primary hover:shadow-hover transition-all duration-300 bg-gradient-card animate-slide-up group ${feature.onClick ? 'cursor-pointer' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={feature.onClick}
              >
                <CardHeader>
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`${feature.color}`} size={28} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
