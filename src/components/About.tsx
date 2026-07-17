import { CheckCircle2 } from "lucide-react";

export const About = () => {
  const steps = [
    {
      title: "Practice Real Exam Questions",
      description: "Access thousands of authentic BECE and Common Entrance questions covering Mathematics, English, Basic Science, and Social Studies.",
    },
    {
      title: "Compete Nationwide",
      description: "Climb leaderboards and compete with students across Nigeria for cash prizes.",
    },
    {
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed analytics and personalized insights.",
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/20">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#40D3F2] mb-4">
              How Éclat Works
            </h2>
            <p className="text-lg text-[#40D3F2] max-w-2xl mx-auto">
              A simple, powerful system that connects students, parents, and schools in the learning journey.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-hover transition-all">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#40D3F2] mb-2">{step.title}</h3>
                      <p className="text-[#40D3F2] leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
