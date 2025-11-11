import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Globe, Building } from "lucide-react";
import { Link } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";

const TertiaryCare = () => {
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

  const stateInstitutions = [
    {
      state: "Karnataka",
      centers: [
        "DIMHANS - Dharwad Institute of Mental Health and Neurosciences",
        "Mental Health Centres under Health Department"
      ]
    },
    {
      state: "Tamil Nadu",
      centers: [
        "Institute of Mental Health, Chennai",
        "District Mental Health Programs"
      ]
    },
    {
      state: "Maharashtra",
      centers: [
        "Regional Mental Hospital, Pune",
        "Institute of Psychiatry, Mumbai"
      ]
    }
  ];

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

        <div className="space-y-8">
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
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                State-Level Rehabilitation Centres
              </CardTitle>
              <CardDescription>
                District and state mental health programs across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stateInstitutions.map((state, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{state.state}</h4>
                    <ul className="space-y-2">
                      {state.centers.map((center, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {center}
                        </li>
                      ))}
                    </ul>
                  </div>
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
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};

export default TertiaryCare;
