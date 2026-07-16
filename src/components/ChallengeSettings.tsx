import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChallengeConfig {
  challengeName: string;
  subject: string;
  numberOfQuestions: number;
  topics: string[];
  maxTime: number;
  maxTimeUnit: 'min' | 'sec';
}

const topicsBySubject: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Number theory'],
  'Physics': ['Mechanics', 'Electricity', 'Waves', 'Thermodynamics', 'Optics', 'Modern physics'],
  'Chemistry': ['Atomic structure', 'Bonding', 'Organic chemistry', 'Acids and bases', 'Stoichiometry', 'Thermochemistry'],
  'Biology': ['Cell biology', 'Genetics', 'Ecology', 'Human physiology', 'Evolution', 'Microbiology'],
  'Computer science': ['Algorithms', 'Data structures', 'Databases', 'Networking', 'Operating systems', 'Programming logic'],
  'English': ['Grammar', 'Comprehension', 'Vocabulary', 'Essay writing', 'Literature'],
  'General knowledge': ['Current affairs', 'History', 'Geography', 'Science trivia', 'Sports', 'Arts and culture']
};

interface ChallengeSettingsProps {
  onNext: (config: ChallengeConfig) => void;
}

export function ChallengeSettings({ onNext }: ChallengeSettingsProps) {
  const navigate = useNavigate();
  const [challengeName, setChallengeName] = useState('');
  const [subject, setSubject] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [topics, setTopics] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState(20);
  const [maxTimeUnit, setMaxTimeUnit] = useState<'min' | 'sec'>('min');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTopics = subject ? topicsBySubject[subject] || [] : [];

  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter(t => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!challengeName.trim()) {
      newErrors.challengeName = 'Enter a challenge name';
    }
    if (!subject) {
      newErrors.subject = 'Select a subject';
    }
    if (numberOfQuestions < 1) {
      newErrors.numberOfQuestions = 'Enter at least 1 question';
    }
    if (topics.length === 0) {
      newErrors.topics = 'Select at least one topic';
    }
    if (maxTime < 1) {
      newErrors.maxTime = 'Enter a maximum time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext({
        challengeName,
        subject,
        numberOfQuestions,
        topics,
        maxTime,
        maxTimeUnit
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-lg border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold">Challenge Settings</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/student')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Configure your duel parameters</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="challengeName">Challenge Name</Label>
              <Input
                id="challengeName"
                placeholder="e.g. Midnight Round 1"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                maxLength={60}
              />
              {errors.challengeName && <p className="text-sm text-destructive">{errors.challengeName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={(value) => { setSubject(value); setTopics([]); }}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Computer science">Computer science</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="General knowledge">General knowledge</SelectItem>
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Questions</Label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setNumberOfQuestions(Math.max(1, numberOfQuestions - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="numberOfQuestions"
                    type="number"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mx-2 text-center"
                    min={1}
                    max={100}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setNumberOfQuestions(Math.min(100, numberOfQuestions + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.numberOfQuestions && <p className="text-sm text-destructive">{errors.numberOfQuestions}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Topics</Label>
              {!subject && (
                <p className="text-sm text-muted-foreground">Select a subject first</p>
              )}
              {subject && availableTopics.length === 0 && (
                <p className="text-sm text-muted-foreground">No topics available for this subject</p>
              )}
              {subject && availableTopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availableTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant={topics.includes(topic) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTopic(topic)}
                    >
                      {topic}
                      {topics.includes(topic) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              )}
              {errors.topics && <p className="text-sm text-destructive">{errors.topics}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTime">Maximum Time</Label>
              <div className="flex gap-2">
                <Input
                  id="maxTime"
                  type="number"
                  value={maxTime}
                  onChange={(e) => setMaxTime(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  placeholder="e.g. 20"
                />
                <div className="flex rounded-md border">
                  <Button
                    type="button"
                    variant={maxTimeUnit === 'min' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMaxTimeUnit('min')}
                    className="rounded-r-none"
                  >
                    min
                  </Button>
                  <Button
                    type="button"
                    variant={maxTimeUnit === 'sec' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setMaxTimeUnit('sec')}
                    className="rounded-l-none"
                  >
                    sec
                  </Button>
                </div>
              </div>
              {errors.maxTime && <p className="text-sm text-destructive">{errors.maxTime}</p>}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/student')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-2 flex-[2]">
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
