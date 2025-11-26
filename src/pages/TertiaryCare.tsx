import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Building, Download, School, Baby, Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";
import { useState } from "react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TertiaryCare = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const rehabilitationCenters = [
    {
      name: "National Institute of Mental Health and Neurosciences (NIMHANS)",
      location: "Bangalore, Karnataka",
      phone: "080-26995000",
      services: ["Psychiatric Rehabilitation", "De-addiction Services", "Geriatric Mental Health"],
      type: "Government"
    },
    {
      name: "Central Institute of Psychiatry",
      location: "Ranchi, Jharkhand",
      phone: "0651-2451070",
      services: ["Rehabilitation Services", "Psychosocial Interventions", "Vocational Training"],
      type: "Government"
    },
    {
      name: "IHBAS - Institute of Human Behaviour and Allied Sciences",
      location: "Delhi",
      phone: "011-22521015",
      services: ["Mental Health Rehabilitation", "Community Mental Health", "Specialized Care"],
      type: "Government"
    }
  ];

  const populationCategories = [
    {
      id: "school",
      title: "School-Based Rehabilitation",
      icon: School,
      color: "text-blue-500",
      services: [
        "School reintegration programs",
        "Special education support",
        "Peer support groups",
        "Family-school collaboration"
      ],
      resources: [
        "School counselors and psychologists",
        "Learning disability support",
        "Behavioral intervention plans",
        "Transition planning services"
      ]
    },
    {
      id: "women",
      title: "Women's Rehabilitation Services",
      icon: Baby,
      color: "text-pink-500",
      services: [
        "Postpartum mental health programs",
        "Trauma recovery services",
        "Mother-baby units",
        "Women's support groups"
      ],
      resources: [
        "Reproductive psychiatry services",
        "Domestic violence support",
        "Childcare assistance programs",
        "Career rehabilitation"
      ]
    },
    {
      id: "workplace",
      title: "Workplace Rehabilitation",
      icon: Briefcase,
      color: "text-green-500",
      services: [
        "Return-to-work programs",
        "Vocational rehabilitation",
        "Workplace accommodations",
        "Occupational therapy"
      ],
      resources: [
        "Employee assistance programs",
        "Job coaching services",
        "Workplace mental health consultants",
        "Disability management programs"
      ]
    },
    {
      id: "senior",
      title: "Geriatric Rehabilitation",
      icon: Users,
      color: "text-purple-500",
      services: [
        "Cognitive rehabilitation",
        "Social engagement programs",
        "Assisted living mental health",
        "Dementia care programs"
      ],
      resources: [
        "Geriatric psychiatry services",
        "Senior day programs",
        "Caregiver support",
        "Home-based rehabilitation"
      ]
    }
  ];

  const generateRehabilProgramPDF = (category: typeof populationCategories[0]) => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text("Tertiary Prevention Program", margin, yPos);
    yPos += 15;

    // Category
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(category.title, margin, yPos);
    yPos += 12;

    // Services Section
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Rehabilitation Services", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    category.services.forEach((service, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${service}`, 165);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6);
    });
    yPos += 10;

    // Resources Section
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Available Resources", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    category.resources.forEach((resource, index) => {
      const lines = doc.splitTextToSize(`• ${resource}`, 165);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6);
    });
    yPos += 15;

    // National Centers
    if (yPos > 200) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("National Rehabilitation Centers", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    rehabilitationCenters.forEach((center) => {
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(center.name, margin, yPos);
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Location: ${center.location}`, margin + 5, yPos);
      yPos += 5;
      doc.text(`Phone: ${center.phone}`, margin + 5, yPos);
      yPos += 5;
      doc.text(`Services: ${center.services.join(', ')}`, margin + 5, yPos);
      yPos += 10;

      if (yPos > 260) {
        doc.addPage();
        yPos = margin;
      }
    });

    // Recommendations
    yPos += 10;
    if (yPos > 230) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("Recovery and Rehabilitation Plan", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const recommendations = [
      "Engage in comprehensive rehabilitation programs",
      "Work with multidisciplinary teams (psychiatrists, therapists, social workers)",
      "Participate in vocational training and skill development",
      "Join peer support groups for shared experiences",
      "Involve family members in the recovery process",
      "Set realistic goals for social and occupational reintegration",
      "Maintain regular follow-up with mental health professionals"
    ];

    recommendations.forEach((rec, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, 165);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Sarvadamana Mental Health Platform", margin, 285);
    doc.text(new Date().toLocaleDateString(), 170, 285);

    doc.save(`${category.id}-rehabilitation-program.pdf`);
    
    toast({
      title: "PDF Generated!",
      description: `Your ${category.title} rehabilitation program has been downloaded.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Tertiary Prevention</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rehabilitation Services - Ministry of Social Justice & Empowerment (IRCA List)
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">National Centers</TabsTrigger>
            <TabsTrigger value="categories">Population Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-primary" />
                  National Rehabilitation Centres
                </CardTitle>
                <CardDescription>
                  Premier institutes recognized by Ministry of Social Justice & Empowerment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {rehabilitationCenters.map((center, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{center.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {center.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{center.phone}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Services Offered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {center.services.map((service, idx) => (
                              <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          Contact Centre
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rehabilitation Services Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Psychiatric Rehabilitation</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive programs for recovery and social reintegration
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Vocational Training</h4>
                    <p className="text-sm text-muted-foreground">
                      Skill development for employment and independence
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Family Support Programs</h4>
                    <p className="text-sm text-muted-foreground">
                      Counseling and education for caregivers
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Community Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Support for returning to community living
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>National Mental Health Programme Helpline:</strong> 1800-599-0019
                  </p>
                  <p className="text-sm">
                    <strong>IRCA (Indian Rehabilitation Council Act):</strong> Visit www.rehabcouncil.nic.in
                  </p>
                  <p className="text-sm">
                    <strong>Ministry of Social Justice & Empowerment:</strong> For complete list of recognized centres
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Population-Specific Rehabilitation Programs</CardTitle>
                <CardDescription>
                  Specialized rehabilitation services for different populations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {populationCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <category.icon className={`h-6 w-6 ${category.color}`} />
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Rehabilitation Services:</h4>
                          <ul className="space-y-1">
                            {category.services.map((service, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2">Available Resources:</h4>
                          <ul className="space-y-1">
                            {category.resources.map((resource, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2 text-muted-foreground">
                                <span className="text-primary mt-1">✓</span>
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          onClick={() => generateRehabilProgramPDF(category)}
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          Download Rehab Program (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <PageNavigation />
    </div>
  );
};

export default TertiaryCare;
