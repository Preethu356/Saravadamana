import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Baby, Brain, Heart, Users, Star, Puzzle, 
  Eye, Ear, MessageCircle, Hand, Activity,
  CheckCircle, ArrowRight, Sparkles, Shield,
  BookOpen, Music, Palette, Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";

const ChildMentalHealth = () => {
  const developmentalAreas = [
    {
      icon: MessageCircle,
      title: "Communication & Language",
      description: "Speech development, verbal & non-verbal communication skills",
      indicators: ["First words", "Sentence formation", "Understanding instructions", "Social communication"],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Users,
      title: "Social Interaction",
      description: "Building relationships and understanding social cues",
      indicators: ["Eye contact", "Shared attention", "Peer relationships", "Emotional reciprocity"],
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: Puzzle,
      title: "Behavioral Patterns",
      description: "Repetitive behaviors, routines, and sensory responses",
      indicators: ["Routine preferences", "Sensory sensitivities", "Play patterns", "Flexibility"],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Brain,
      title: "Cognitive Development",
      description: "Learning styles, attention, and problem-solving abilities",
      indicators: ["Focus & attention", "Memory", "Problem solving", "Learning pace"],
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  const earlyWarningSignsAges = [
    {
      age: "6-12 months",
      signs: [
        "Limited eye contact during feeding/play",
        "Doesn't respond to name",
        "Doesn't babble or coo",
        "No smiling at caregivers"
      ]
    },
    {
      age: "12-18 months",
      signs: [
        "No pointing or waving",
        "Limited interest in other children",
        "No single words by 16 months",
        "Loss of previously acquired skills"
      ]
    },
    {
      age: "18-24 months",
      signs: [
        "No two-word phrases by 24 months",
        "Unusual play patterns",
        "Extreme distress with changes",
        "Doesn't engage in pretend play"
      ]
    },
    {
      age: "2-3 years",
      signs: [
        "Difficulty with peers",
        "Repetitive movements",
        "Unusual sensory reactions",
        "Speech delays or regression"
      ]
    }
  ];

  const interventionPrograms = [
    {
      name: "Applied Behavior Analysis (ABA)",
      description: "Evidence-based therapy focusing on improving specific behaviors",
      duration: "20-40 hours/week",
      icon: Activity,
      color: "text-blue-500"
    },
    {
      name: "Speech & Language Therapy",
      description: "Developing communication skills and language comprehension",
      duration: "2-5 sessions/week",
      icon: MessageCircle,
      color: "text-green-500"
    },
    {
      name: "Occupational Therapy",
      description: "Building daily living skills and sensory integration",
      duration: "1-3 sessions/week",
      icon: Hand,
      color: "text-purple-500"
    },
    {
      name: "Play Therapy",
      description: "Using play to develop social and emotional skills",
      duration: "1-2 sessions/week",
      icon: Puzzle,
      color: "text-pink-500"
    },
    {
      name: "Music Therapy",
      description: "Using music to enhance communication and social skills",
      duration: "1-2 sessions/week",
      icon: Music,
      color: "text-orange-500"
    },
    {
      name: "Art Therapy",
      description: "Creative expression for emotional development",
      duration: "1-2 sessions/week",
      icon: Palette,
      color: "text-cyan-500"
    }
  ];

  const supportResources = [
    {
      title: "Parent Training Programs",
      description: "Learn strategies to support your child at home",
      link: "/resources"
    },
    {
      title: "Early Intervention Centers",
      description: "Find certified ASD intervention centers near you",
      link: "/secondary-care"
    },
    {
      title: "Support Groups",
      description: "Connect with other families on similar journeys",
      link: "/resources"
    },
    {
      title: "Educational Resources",
      description: "Materials and guides for understanding ASD",
      link: "/resources"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <PageNavigation />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Baby className="w-4 h-4 mr-2" />
              Early Intervention Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Child Mental Health & Development
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized early intervention programs for Autism Spectrum Disorder (ASD) 
              and developmental support for children and families
            </p>
          </motion.div>

          {/* Mind Physics Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Mind Physics™ Engine</h3>
                      <p className="text-muted-foreground">
                        Interactive tools for thought, emotion, and behavior regulation
                      </p>
                    </div>
                  </div>
                  <Link to="/mind-physics">
                    <Button size="lg" className="gap-2">
                      Explore Mind Physics
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Developmental Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Key Developmental Areas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {developmentalAreas.map((area, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <div className={`p-3 ${area.bgColor} rounded-lg w-fit mb-2`}>
                      <area.icon className={`w-6 h-6 ${area.color}`} />
                    </div>
                    <CardTitle className="text-lg">{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {area.indicators.map((indicator, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Early Warning Signs by Age */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Early Warning Signs by Age</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {earlyWarningSignsAges.map((ageGroup, index) => (
                <Card key={index} className="border-amber-500/30 bg-amber-500/5">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit border-amber-500 text-amber-600">
                      <Clock className="w-3 h-3 mr-1" />
                      {ageGroup.age}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {ageGroup.signs.map((sign, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Eye className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              ⚠️ These are potential indicators. Early professional assessment is recommended if you notice multiple signs.
            </p>
          </motion.div>

          {/* Intervention Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Evidence-Based Intervention Programs</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {interventionPrograms.map((program, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <program.icon className={`w-6 h-6 ${program.color}`} />
                      <Badge variant="secondary" className="text-xs">
                        {program.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Developmental Screening Tool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Developmental Screening Assessment</CardTitle>
                    <CardDescription>
                      M-CHAT-R/F based screening for children aged 16-30 months
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Our screening tool helps identify children who may benefit from early intervention services. 
                  This is not a diagnostic tool but can guide parents on when to seek professional evaluation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/screening/students">
                    <Button className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      Start Developmental Screening
                    </Button>
                  </Link>
                  <Link to="/secondary-care">
                    <Button variant="outline" className="gap-2">
                      <Users className="w-4 h-4" />
                      Find Specialists
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Support Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportResources.map((resource, index) => (
                <Link to={resource.link} key={index}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Learn More <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Important Information</h3>
                    <p className="text-muted-foreground text-sm">
                      Early intervention is crucial for optimal outcomes. If you have concerns about your child's 
                      development, please consult with a pediatrician or developmental specialist. This platform 
                      provides educational resources and preliminary screening tools, but professional evaluation 
                      is essential for accurate diagnosis and treatment planning.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ChildMentalHealth;