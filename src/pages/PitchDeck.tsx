import { motion } from "framer-motion";
import { Users, AlertTriangle, TrendingUp, Shield, Target, Sparkles, Heart, Brain, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Watermark from "@/components/Watermark";

const PitchDeck = () => {
  const demographics = [
    {
      icon: "🎓",
      label: "Students",
      percentage: "35%",
      description: "Academic pressure, isolation, career anxiety",
      color: "from-cyan-500/20 to-blue-500/20",
      glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]"
    },
    {
      icon: "💼",
      label: "Working Professionals",
      percentage: "40%",
      description: "Burnout, work-life imbalance, stress",
      color: "from-purple-500/20 to-pink-500/20",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]"
    },
    {
      icon: "👩",
      label: "Women",
      percentage: "60%",
      description: "Higher prevalence, reproductive mental health",
      color: "from-rose-500/20 to-orange-500/20",
      glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]"
    },
    {
      icon: "👴",
      label: "Elderly",
      percentage: "15%",
      description: "Loneliness, cognitive decline, chronic illness",
      color: "from-emerald-500/20 to-teal-500/20",
      glow: "shadow-[0_0_30px_rgba(16,185,129,0.3)]"
    }
  ];

  const barriers = [
    {
      icon: Shield,
      title: "Stigma",
      description: "Cultural shame and fear of judgment prevent help-seeking",
      stat: "62% avoid treatment due to stigma",
      color: "text-red-400",
      borderColor: "border-red-500/30"
    },
    {
      icon: Clock,
      title: "Access",
      description: "Limited mental health infrastructure and long wait times",
      stat: "1 psychiatrist per 100,000 people",
      color: "text-orange-400",
      borderColor: "border-orange-500/30"
    },
    {
      icon: AlertTriangle,
      title: "Awareness",
      description: "Lack of mental health literacy and recognition of symptoms",
      stat: "76% can't identify mental illness",
      color: "text-yellow-400",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: DollarSign,
      title: "Cost",
      description: "Therapy and medication are financially inaccessible",
      stat: "₹2000-5000 per session",
      color: "text-green-400",
      borderColor: "border-green-500/30"
    }
  ];

  const psychologicalNeeds = [
    { need: "Early Detection", icon: Target, color: "text-cyan-400" },
    { need: "Anonymous Support", icon: Shield, color: "text-purple-400" },
    { need: "Accessible Care", icon: Heart, color: "text-pink-400" },
    { need: "Continuous Monitoring", icon: TrendingUp, color: "text-blue-400" },
    { need: "Evidence-Based Treatment", icon: Brain, color: "text-emerald-400" },
    { need: "Stigma-Free Environment", icon: Sparkles, color: "text-orange-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <Watermark />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 px-6 py-2 text-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Sparkles className="h-4 w-4 mr-2 inline" />
            Pitch Deck
          </Badge>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Audience & Problem Landscape
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Understanding the mental health crisis and our mission to transform care delivery
          </p>
        </motion.div>

        {/* Treatment Gap - Hero Stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
            <CardContent className="p-12 text-center relative">
              <AlertTriangle className="h-20 w-20 mx-auto mb-6 text-red-400 animate-pulse" />
              <div className="text-8xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                70-92%
              </div>
              <h3 className="text-3xl font-semibold text-white mb-4">Treatment Gap</h3>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Of individuals with mental health conditions remain <span className="text-red-400 font-semibold">untreated</span> due to systemic barriers, creating a massive public health crisis
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Undiagnosed Population */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">The Invisible Epidemic</h2>
            <p className="text-xl text-gray-400">Millions suffering in silence</p>
          </div>
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <CardContent className="p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Brain className="h-16 w-16 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-white">Undiagnosed Population</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Many individuals don't recognize their symptoms as mental health issues, leading to delayed or absent diagnosis. Without proper screening tools and awareness, conditions worsen silently.
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl">•</span>
                      <span>Normalized suffering as "just stress" or "weakness"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl">•</span>
                      <span>Lack of accessible screening and assessment tools</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-400 text-xl">•</span>
                      <span>Cultural beliefs that discourage discussing mental health</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <div className="text-6xl font-bold text-purple-400 mb-4">150M+</div>
                    <p className="text-xl text-white">Indians with mental disorders</p>
                    <div className="text-5xl font-bold text-cyan-400 mt-6 mb-4">90%</div>
                    <p className="text-lg text-gray-300">Never receive proper diagnosis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Demographics Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Target Demographics</h2>
            <p className="text-xl text-gray-400">Who needs SARVADAMANA most?</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demographics.map((demo, index) => (
              <motion.div
                key={demo.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${demo.color} border-white/10 backdrop-blur-xl ${demo.glow} hover:scale-105 transition-transform duration-300 h-full`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{demo.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{demo.label}</h3>
                    <div className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {demo.percentage}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{demo.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Psychological Needs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Psychological Needs</h2>
            <p className="text-xl text-gray-400">Essential requirements for effective mental healthcare</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {psychologicalNeeds.map((item, index) => (
              <motion.div
                key={item.need}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/20 backdrop-blur-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <item.icon className={`h-12 w-12 mb-4 ${item.color}`} />
                    <h3 className="text-xl font-semibold text-white">{item.need}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Barriers Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Critical Barriers</h2>
            <p className="text-xl text-gray-400">Why traditional mental healthcare fails</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {barriers.map((barrier, index) => (
              <motion.div
                key={barrier.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br from-white/5 to-white/10 border-2 ${barrier.borderColor} backdrop-blur-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-300 h-full`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <barrier.icon className={`h-8 w-8 ${barrier.color}`} />
                      <span className="text-white">{barrier.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg text-gray-300 leading-relaxed">{barrier.description}</p>
                    <div className={`text-3xl font-bold ${barrier.color}`}>{barrier.stat}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Underserved */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(249,115,22,0.2)]">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-white flex items-center justify-center gap-3">
                <Users className="h-10 w-10 text-orange-400" />
                Why This Audience Is Underserved
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <span className="text-2xl">🚫</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Infrastructure Gap</h4>
                      <p className="text-gray-300">Only 0.75 psychiatrists per 100,000 people vs. WHO recommendation of 3 per 100,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <span className="text-2xl">💸</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Economic Barriers</h4>
                      <p className="text-gray-300">Mental health services are rarely covered by insurance, making them unaffordable for most</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Cultural Stigma</h4>
                      <p className="text-gray-300">Deep-rooted shame prevents help-seeking, especially in collectivist cultures where mental illness is taboo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Geographic Disparity</h4>
                      <p className="text-gray-300">Mental health resources concentrated in urban areas, leaving rural populations without access</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How SARVADAMANA Fills The Gap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-500/30 backdrop-blur-xl shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
            <CardHeader className="relative">
              <CardTitle className="text-4xl text-center text-white flex items-center justify-center gap-3">
                <Sparkles className="h-12 w-12 text-cyan-400 animate-pulse" />
                How SARVADAMANA Fills The Gap
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 relative">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <Target className="h-16 w-16 mx-auto mb-4 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white mb-3">Early Detection</h3>
                    <p className="text-gray-300 leading-relaxed">AI-powered screening tools identify mental health concerns before they escalate, enabling preventive intervention</p>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-2xl font-bold text-white mb-3">Stigma-Free Access</h3>
                    <p className="text-gray-300 leading-relaxed">Anonymous, digital-first approach removes cultural barriers and shame, making support accessible to everyone</p>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-pink-400" />
                    <h3 className="text-2xl font-bold text-white mb-3">Continuous Care</h3>
                    <p className="text-gray-300 leading-relaxed">24/7 AI support, mood tracking, and personalized interventions ensure consistent mental wellness monitoring</p>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <Badge className="px-8 py-3 text-xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <TrendingUp className="h-5 w-5 mr-3 inline" />
                  Bridging the 70-92% treatment gap through technology & compassion
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PitchDeck;