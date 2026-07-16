import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Swords, Clock, FileText, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  username: string;
  school: string;
  grade: string;
}

interface ChallengeConfig {
  challengeName: string;
  subject: string;
  numberOfQuestions: number;
  topics: string[];
  maxTime: number;
  maxTimeUnit: 'min' | 'sec';
}

interface ChallengeConfirmationProps {
  onBack: () => void;
  onConfirm: () => void;
  opponent: Student;
  config: ChallengeConfig;
}

export function ChallengeConfirmation({ onBack, onConfirm, opponent, config }: ChallengeConfirmationProps) {
  const navigate = useNavigate();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold">Confirm Duel</CardTitle>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Review your challenge details</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-medium">
              {config.challengeName}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-sm font-bold">
                {getInitials(opponent.name)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{opponent.name}</p>
                <p className="text-sm text-muted-foreground">{opponent.username} · {opponent.school}</p>
              </div>
              <User className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subject</span>
                <span className="font-medium">{config.subject}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Topics</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                  {config.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Questions</span>
                </div>
                <span className="font-medium">{config.numberOfQuestions}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Time Limit</span>
                </div>
                <span className="font-medium">{config.maxTime} {config.maxTimeUnit}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-2 flex-[2]"
            >
              <Swords className="h-4 w-4 mr-2" />
              Send Challenge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
