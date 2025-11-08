import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Scale, Copyright } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ComplianceFooter = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Compliance & Legal Information</h2>
            <p className="text-muted-foreground">
              Our commitment to privacy, security, and ethical mental health care
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hipaa">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  HIPAA Compliance Guidelines
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold">Privacy Rule Compliance</h4>
                  <ul className="space-y-2 text-sm">
                    <li>All personal health information (PHI) is encrypted and stored securely</li>
                    <li>Access to health data is restricted to authorized personnel only</li>
                    <li>Users have the right to access, amend, and request restrictions on their PHI</li>
                    <li>Minimum necessary standard applied to all PHI disclosures</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Security Measures</h4>
                  <ul className="space-y-2 text-sm">
                    <li>End-to-end encryption for all data transmission</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Secure authentication and access controls</li>
                    <li>Incident response plan in place for potential breaches</li>
                  </ul>

                  <h4 className="font-semibold mt-4">User Rights</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Right to access your health information</li>
                    <li>Right to request corrections to your records</li>
                    <li>Right to receive breach notifications</li>
                    <li>Right to file complaints about privacy violations</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="who">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  WHO Mental Health Guidelines
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold">WHO Framework Adherence</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Evidence-based interventions aligned with WHO Mental Health Action Plan 2013-2030</li>
                    <li>Integration of mental health into primary care as recommended by WHO</li>
                    <li>Community-based approach to mental health service delivery</li>
                    <li>Focus on human rights and dignity in mental health care</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Quality Standards</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Use of WHO-recommended screening tools and assessments</li>
                    <li>Promotion of mental health literacy and awareness</li>
                    <li>Prevention strategies based on WHO best practices</li>
                    <li>Culturally appropriate mental health interventions</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Service Principles</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Universal access to mental health services</li>
                    <li>Early intervention and prevention focus</li>
                    <li>Multisectoral collaboration approach</li>
                    <li>Recovery-oriented care philosophy</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mental-health-act">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Mental Health Act Guidelines
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold">Rights of Persons with Mental Illness</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Right to access mental health services without discrimination</li>
                    <li>Right to confidentiality and privacy of health information</li>
                    <li>Right to informed consent for treatment</li>
                    <li>Right to community living and social integration</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Ethical Treatment Standards</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Least restrictive treatment environment</li>
                    <li>Prohibition of cruel, inhuman or degrading treatment</li>
                    <li>Protection from exploitation and abuse</li>
                    <li>Regular review of treatment plans</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Service Provider Obligations</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Maintain professional ethical standards</li>
                    <li>Ensure qualified mental health professionals</li>
                    <li>Provide culturally sensitive care</li>
                    <li>Regular monitoring and quality assurance</li>
                  </ul>

                  <h4 className="font-semibold mt-4">Crisis Intervention</h4>
                  <ul className="space-y-2 text-sm">
                    <li>24/7 crisis support availability</li>
                    <li>Emergency intervention protocols</li>
                    <li>Coordination with emergency services</li>
                    <li>Family and caregiver support systems</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="h-6 w-6 text-primary" />
                Copyright Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">© 2025 Dr Preetham K S Gowda. All Rights Reserved.</p>
                <p className="text-muted-foreground">
                  This application, including all content, features, functionality, design elements, and underlying code, 
                  is the intellectual property of Dr Preetham K S Gowda and is protected by international copyright laws.
                </p>
                <p className="text-muted-foreground">
                  Unauthorized reproduction, distribution, modification, or commercial use of any materials from this 
                  application is strictly prohibited without prior written permission.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Contact:</strong> For licensing inquiries or permissions, please contact the copyright holder.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>
              This application is designed to supplement, not replace, professional mental health care. 
              Always consult qualified healthcare providers for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceFooter;
