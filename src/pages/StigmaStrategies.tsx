import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  MessageSquare, 
  Users, 
  Heart, 
  BookOpen, 
  Share2, 
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Shield,
  Brain,
  Sparkles,
  MessageCircle,
  GraduationCap,
  HandHeart,
  Trophy,
  Award
} from "lucide-react";
import { useStigmaProgress } from "@/hooks/useStigmaProgress";
import { toast } from "sonner";

interface ToolQuestion {
  id: string;
  question: string;
  options?: { value: number; label: string }[];
  type: "radio" | "text";
}

const StigmaStrategies = () => {
  const { saveProgress, getToolProgress, badges, loading } = useStigmaProgress();
  const [activeToolResponses, setActiveToolResponses] = useState<Record<string, any>>({});

  const toolQuestions: Record<string, ToolQuestion[]> = {
    "myth-facts": [
      {
        id: "q1",
        question: "Before this exercise, did you believe any of these myths?",
        type: "radio",
        options: [
          { value: 0, label: "No, I knew they were all myths" },
          { value: 1, label: "Yes, I believed 1-2 myths" },
          { value: 2, label: "Yes, I believed 3 or more myths" }
        ]
      },
      {
        id: "q2",
        question: "Which fact surprised you the most and why?",
        type: "text"
      }
    ],
    "story-simulator": [
      {
        id: "q1",
        question: "Practice your response: How would you tell a friend about seeking mental health support?",
        type: "text"
      },
      {
        id: "q2",
        question: "Rate your comfort level sharing your mental health journey",
        type: "radio",
        options: [
          { value: 1, label: "Very uncomfortable" },
          { value: 2, label: "Somewhat uncomfortable" },
          { value: 3, label: "Neutral" },
          { value: 4, label: "Comfortable" },
          { value: 5, label: "Very comfortable" }
        ]
      }
    ],
    "self-talk-test": [
      {
        id: "q1",
        question: "Write down a negative thought you've had about your mental health",
        type: "text"
      },
      {
        id: "q2",
        question: "Now reframe it: What would you say to a friend experiencing the same?",
        type: "text"
      },
      {
        id: "q3",
        question: "How often do you judge yourself harshly for mental health struggles?",
        type: "radio",
        options: [
          { value: 5, label: "Always" },
          { value: 4, label: "Often" },
          { value: 3, label: "Sometimes" },
          { value: 2, label: "Rarely" },
          { value: 1, label: "Never" }
        ]
      }
    ],
    "literacy-challenge": [
      {
        id: "q1",
        question: "Name 3 mental health conditions you can identify:",
        type: "text"
      },
      {
        id: "q2",
        question: "What's the difference between a psychiatrist and a psychologist?",
        type: "text"
      },
      {
        id: "q3",
        question: "Rate your mental health literacy",
        type: "radio",
        options: [
          { value: 1, label: "Beginner" },
          { value: 2, label: "Basic understanding" },
          { value: 3, label: "Moderate knowledge" },
          { value: 4, label: "Good knowledge" },
          { value: 5, label: "Expert level" }
        ]
      }
    ],
    "compassion-builder": [
      {
        id: "q1",
        question: "Choose your response: A friend says they're feeling depressed",
        type: "radio",
        options: [
          { value: 5, label: "Thank you for trusting me. How can I support you?" },
          { value: 3, label: "That's tough. Have you tried exercising?" },
          { value: 1, label: "Everyone feels sad sometimes, you'll be fine" }
        ]
      },
      {
        id: "q2",
        question: "Write a compassionate response to someone sharing they're seeing a therapist:",
        type: "text"
      },
      {
        id: "q3",
        question: "How comfortable are you supporting someone with mental health challenges?",
        type: "radio",
        options: [
          { value: 1, label: "Very uncomfortable" },
          { value: 2, label: "Somewhat uncomfortable" },
          { value: 3, label: "Neutral" },
          { value: 4, label: "Comfortable" },
          { value: 5, label: "Very comfortable" }
        ]
      }
    ]
  };

  const handleToolResponse = (toolId: string, questionId: string, value: any) => {
    setActiveToolResponses({
      ...activeToolResponses,
      [toolId]: {
        ...activeToolResponses[toolId],
        [questionId]: value
      }
    });
  };

  const handleSubmitTool = async (toolId: string, toolName: string) => {
    const responses = activeToolResponses[toolId];
    const questions = toolQuestions[toolId];
    
    if (!responses || Object.keys(responses).length < questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    // Calculate score based on responses
    let score = 0;
    questions.forEach(q => {
      if (q.type === "radio" && typeof responses[q.id] === "number") {
        score += responses[q.id];
      }
    });

    await saveProgress(toolId, responses, score);
    setActiveToolResponses({ ...activeToolResponses, [toolId]: {} });
  };

  const stigmaTools = [
    {
      id: "myth-facts",
      title: "Myth vs Facts",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      description: "Challenge common misconceptions about mental health",
      content: [
        {
          myth: "Mental illness is a sign of weakness",
          fact: "Mental illness is a medical condition, not a character flaw. It affects brain chemistry and function, just like diabetes affects the pancreas."
        },
        {
          myth: "People with mental illness are violent and dangerous",
          fact: "Most people with mental illness are not violent. They are actually more likely to be victims of violence than perpetrators."
        },
        {
          myth: "Mental health problems are rare",
          fact: "1 in 4 people will experience a mental health problem in any given year. It's incredibly common."
        },
        {
          myth: "You can just snap out of depression",
          fact: "Depression is a serious medical condition that requires treatment. You can't will yourself out of it any more than you can will away cancer."
        }
      ]
    },
    {
      id: "story-simulator",
      title: "Personal Story Simulator",
      icon: MessageCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      description: "Practice sharing your mental health journey"
    },
    {
      id: "self-talk-test",
      title: "Talking to Yourself Test",
      icon: Sparkles,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      description: "Identify and challenge your inner stigma"
    },
    {
      id: "literacy-challenge",
      title: "Mental Health Literacy Challenges",
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      description: "Test and expand your mental health knowledge"
    },
    {
      id: "compassion-builder",
      title: "Peer Compassion Builder",
      icon: HandHeart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      description: "Develop empathy and supportive responses"
    }
  ];

  const strategies = [
    {
      category: "Personal Level",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800",
      items: [
        {
          title: "Talk Openly About Mental Health",
          description: "Share your own experiences when comfortable. Personal stories humanize mental health struggles and show others they're not alone.",
          action: "Start small: mention your therapy appointment as casually as a doctor's visit"
        },
        {
          title: "Use Person-First Language",
          description: "Say 'person with depression' instead of 'depressed person'. This recognizes the individual beyond their condition.",
          action: "Practice: Replace stigmatizing terms in your vocabulary"
        },
        {
          title: "Educate Yourself Continuously",
          description: "Learn about mental health conditions, treatments, and recovery. Knowledge combats misconceptions and fear.",
          action: "Read one reputable mental health article or book monthly"
        },
        {
          title: "Challenge Your Own Biases",
          description: "Recognize that everyone has unconscious biases about mental illness. Self-awareness is the first step to change.",
          action: "Reflect: What assumptions do I make about people with mental illness?"
        }
      ]
    },
    {
      category: "Social Level",
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      items: [
        {
          title: "Correct Stigmatizing Comments",
          description: "Gently challenge jokes, slurs, or misconceptions about mental health when you hear them.",
          action: "Response template: 'I don't think that's accurate. Here's what I know...'"
        },
        {
          title: "Listen Without Judgment",
          description: "When someone shares their mental health struggles, listen actively without offering unsolicited advice or dismissing their feelings.",
          action: "Practice: Just say 'Thank you for trusting me' and ask how you can support"
        },
        {
          title: "Support Mental Health Initiatives",
          description: "Participate in awareness campaigns, fundraisers, or community programs that promote mental health.",
          action: "Join one local or online mental health advocacy group"
        },
        {
          title: "Be Visible in Your Support",
          description: "Attend mental health events, wear awareness ribbons, or share resources on social media.",
          action: "Share mental health resources during awareness months (May & October)"
        }
      ]
    },
    {
      category: "Community Level",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      items: [
        {
          title: "Advocate for Policy Change",
          description: "Support legislation that improves mental health care access and protects individuals from discrimination.",
          action: "Contact your representatives about mental health parity laws"
        },
        {
          title: "Promote Workplace Mental Health",
          description: "Encourage employers to provide mental health days, Employee Assistance Programs, and anti-stigma training.",
          action: "Suggest mental health workshops or wellness programs at your workplace"
        },
        {
          title: "Support Inclusive Media Representation",
          description: "Advocate for accurate, empathetic portrayals of mental health in media and entertainment.",
          action: "Praise accurate representations and provide feedback on stigmatizing content"
        },
        {
          title: "Create Safe Spaces",
          description: "Help establish support groups, peer networks, or safe spaces where people can discuss mental health openly.",
          action: "Start a mental health discussion group in your community or workplace"
        }
      ]
    }
  ];

  const quickActions = [
    {
      title: "Today",
      icon: CheckCircle2,
      actions: [
        "Use person-first language in all conversations",
        "Check in with someone who might be struggling",
        "Share a mental health resource on social media"
      ]
    },
    {
      title: "This Week",
      icon: TrendingUp,
      actions: [
        "Read an article about a mental health condition",
        "Challenge one stigmatizing comment you hear",
        "Start a conversation about mental wellness with friends"
      ]
    },
    {
      title: "This Month",
      icon: Shield,
      actions: [
        "Join a mental health advocacy organization",
        "Attend a mental health awareness event",
        "Share your own mental health journey (if comfortable)"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(var(--primary)) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
              <Lightbulb className="w-4 h-4 mr-2" />
              Realistic Strategies
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-red-600 to-primary bg-clip-text text-transparent">
              Fight Mental Health Stigma
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practical, evidence-based strategies you can implement today to reduce stigma and create a more supportive environment for mental health.
            </p>
          </motion.div>

          {/* Badges Display */}
          {badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {badges.map((badge) => (
                      <Badge key={badge.id} variant="secondary" className="px-4 py-2 text-sm flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {badge.badge_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Key Principles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              {
                icon: MessageSquare,
                title: "Speak Up",
                description: "Your voice matters. Every conversation helps normalize mental health."
              },
              {
                icon: BookOpen,
                title: "Educate",
                description: "Knowledge is power. Learn and share accurate information."
              },
              {
                icon: Share2,
                title: "Take Action",
                description: "Small steps create big change. Start today, right where you are."
              }
            ].map((principle, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-2 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <principle.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{principle.title}</CardTitle>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Stigma-Free Tools */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Interactive Stigma-Free Tools</h2>
            <p className="text-xl text-muted-foreground">
              Complete exercises, earn badges, and track your progress
            </p>
          </motion.div>

          <Tabs defaultValue="myth-facts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
              {stigmaTools.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="gap-2">
                  <tool.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tool.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {stigmaTools.map((tool) => {
              const toolProgress = getToolProgress(tool.id);
              const completionCount = toolProgress.length;
              
              return (
                <TabsContent key={tool.id} value={tool.id}>
                  <Card className={`border-2 ${tool.bgColor}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl ${tool.bgColor} border-2 flex items-center justify-center`}>
                            <tool.icon className={`w-7 h-7 ${tool.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{tool.title}</CardTitle>
                            <CardDescription className="text-base">{tool.description}</CardDescription>
                          </div>
                        </div>
                        {completionCount > 0 && (
                          <Badge variant="secondary" className="px-3 py-1">
                            Completed {completionCount}x
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Display educational content first */}
                      {tool.id === "myth-facts" && tool.content && (
                        <div className="space-y-4 mb-8">
                          <h3 className="text-lg font-semibold mb-4">Common Myths Debunked:</h3>
                          {tool.content.map((item, index) => (
                            <div key={index} className="border-l-4 border-red-500 pl-4 py-2 bg-background/50 rounded-r-lg">
                              <p className="font-semibold text-red-600 dark:text-red-400 mb-2">
                                ❌ Myth: {item.myth}
                              </p>
                              <p className="text-green-600 dark:text-green-400 font-medium">
                                ✓ Fact: {item.fact}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Questions */}
                      <div className="space-y-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Complete the Exercise:</h3>
                        {toolQuestions[tool.id]?.map((question, qIndex) => (
                          <div key={question.id} className="space-y-3">
                            <Label className="text-base font-medium">
                              {qIndex + 1}. {question.question}
                            </Label>
                            
                            {question.type === "radio" && question.options && (
                              <RadioGroup
                                value={activeToolResponses[tool.id]?.[question.id]?.toString()}
                                onValueChange={(value) => handleToolResponse(tool.id, question.id, parseInt(value))}
                              >
                                <div className="space-y-2">
                                  {question.options.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                                      <RadioGroupItem value={option.value.toString()} id={`${tool.id}-${question.id}-${option.value}`} />
                                      <Label htmlFor={`${tool.id}-${question.id}-${option.value}`} className="flex-1 cursor-pointer">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </RadioGroup>
                            )}
                            
                            {question.type === "text" && (
                              <Textarea
                                placeholder="Type your response here..."
                                value={activeToolResponses[tool.id]?.[question.id] || ""}
                                onChange={(e) => handleToolResponse(tool.id, question.id, e.target.value)}
                                className="min-h-[100px]"
                              />
                            )}
                          </div>
                        ))}
                        
                        <Button
                          onClick={() => handleSubmitTool(tool.id, tool.title)}
                          className="w-full md:w-auto"
                          size="lg"
                        >
                          Submit & Save Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Stigma-Reduction Strategies</h2>
            <p className="text-xl text-muted-foreground">
              Evidence-based approaches organized by impact level
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {strategies.map((strategy, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className={`border-2 ${strategy.borderColor} ${strategy.bgColor}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full ${strategy.bgColor} border-2 ${strategy.borderColor} flex items-center justify-center`}>
                        <strategy.icon className={`w-6 h-6 ${strategy.color}`} />
                      </div>
                      <CardTitle className="text-2xl">{strategy.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {strategy.items.map((item, itemIndex) => (
                        <Card key={itemIndex} className="border bg-background/50">
                          <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg">
                              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-sm font-medium">{item.action}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Your Action Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start making a difference with these actionable steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((timeframe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <timeframe.icon className="w-6 h-6 text-primary" />
                      <CardTitle className="text-xl">{timeframe.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {timeframe.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StigmaStrategies;
