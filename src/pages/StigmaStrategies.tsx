import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  HandHeart
} from "lucide-react";

const StigmaStrategies = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

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
      description: "Practice sharing your mental health journey",
      prompts: [
        "Imagine telling a friend about your therapy appointment as casually as a dentist visit.",
        "Practice saying: 'I'm working on my mental health with a professional, and it's helping me grow.'",
        "How would you explain your anxiety to someone who's never experienced it?",
        "What would you say if a colleague asked why you took a mental health day?"
      ]
    },
    {
      id: "self-talk-test",
      title: "Talking to Yourself Test",
      icon: Sparkles,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      description: "Identify and challenge your inner stigma",
      questions: [
        "Would you say the same things to a friend struggling with mental health?",
        "Are you judging yourself more harshly than you would judge others?",
        "Do you minimize your struggles by thinking others have it worse?",
        "Are you avoiding seeking help because you think you should be stronger?"
      ]
    },
    {
      id: "literacy-challenge",
      title: "Mental Health Literacy Challenges",
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      description: "Test and expand your mental health knowledge",
      challenges: [
        "Can you name 5 different mental health conditions?",
        "Do you know the difference between a psychiatrist and a psychologist?",
        "Can you identify 3 early warning signs of depression?",
        "Do you know what to say when someone confides in you about their mental health?"
      ]
    },
    {
      id: "compassion-builder",
      title: "Peer Compassion Builder",
      icon: HandHeart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      description: "Develop empathy and supportive responses",
      scenarios: [
        {
          situation: "A coworker shares they're struggling with anxiety",
          goodResponse: "Thank you for trusting me. How can I support you?",
          badResponse: "Everyone gets stressed sometimes, you'll be fine."
        },
        {
          situation: "A friend mentions they're seeing a therapist",
          goodResponse: "That's really brave. I hope it helps you feel better.",
          badResponse: "You don't seem like someone who needs therapy."
        },
        {
          situation: "Someone cancels plans due to mental health reasons",
          goodResponse: "No worries at all. Take care of yourself. Let me know if you need anything.",
          badResponse: "Again? You're always canceling on me."
        }
      ]
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
              Explore these interactive exercises to challenge stigma and build compassion
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

            {stigmaTools.map((tool) => (
              <TabsContent key={tool.id} value={tool.id}>
                <Card className={`border-2 ${tool.bgColor}`}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl ${tool.bgColor} border-2 flex items-center justify-center`}>
                        <tool.icon className={`w-7 h-7 ${tool.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{tool.title}</CardTitle>
                        <CardDescription className="text-base">{tool.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tool.id === "myth-facts" && tool.content && (
                      <div className="space-y-4">
                        {tool.content.map((item, index) => (
                          <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
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

                    {tool.id === "story-simulator" && tool.prompts && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {tool.prompts.map((prompt, index) => (
                          <Card key={index} className="border-2">
                            <CardContent className="pt-6">
                              <p className="text-muted-foreground italic">"{prompt}"</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {tool.id === "self-talk-test" && tool.questions && (
                      <div className="space-y-3">
                        {tool.questions.map((question, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                            <CheckCircle2 className={`w-5 h-5 ${tool.color} mt-0.5 flex-shrink-0`} />
                            <p className="font-medium">{question}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {tool.id === "literacy-challenge" && tool.challenges && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {tool.challenges.map((challenge, index) => (
                          <Card key={index} className="border-2 border-orange-200 dark:border-orange-800">
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <Badge variant="secondary" className="mt-1">
                                  {index + 1}
                                </Badge>
                                <p className="font-medium">{challenge}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {tool.id === "compassion-builder" && tool.scenarios && (
                      <div className="space-y-6">
                        {tool.scenarios.map((scenario, index) => (
                          <Card key={index} className="border-2">
                            <CardHeader>
                              <CardTitle className="text-lg">Scenario {index + 1}</CardTitle>
                              <CardDescription className="text-base italic">
                                "{scenario.situation}"
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                                <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                                  ✓ Supportive Response:
                                </p>
                                <p className="text-sm">"{scenario.goodResponse}"</p>
                              </div>
                              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                                <p className="font-medium text-red-700 dark:text-red-400 mb-1">
                                  ❌ Stigmatizing Response:
                                </p>
                                <p className="text-sm">"{scenario.badResponse}"</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Strategies by Level */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {strategies.map((category, catIndex) => (
              <motion.div key={catIndex} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center border-2 ${category.borderColor}`}>
                    <category.icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h2 className="text-3xl font-bold">{category.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Card 
                      key={itemIndex} 
                      className={`border-2 ${category.borderColor} hover:shadow-lg transition-all duration-300`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-start gap-2">
                          <CheckCircle2 className={`w-5 h-5 mt-1 ${category.color} flex-shrink-0`} />
                          <span>{item.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-muted-foreground">{item.description}</p>
                        <div className={`p-3 rounded-lg ${category.bgColor} border ${category.borderColor}`}>
                          <p className={`text-sm font-medium ${category.color}`}>
                            <strong>Action:</strong> {item.action}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Action Plan */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Your Action Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start making a difference with these time-based goals
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
                <Card className="h-full border-2 border-primary/20">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <timeframe.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{timeframe.title}</CardTitle>
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

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Every Action Counts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              You don't need to be an expert or advocate to make a difference. Start with one small action today, and you'll be part of the solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Button size="lg" className="gap-2">
                <Heart className="w-5 h-5" />
                Take the Pledge
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="w-5 h-5" />
                Share Strategies
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StigmaStrategies;
