import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";

const Gallery = () => {
  const galleryItems = [
    {
      title: "Mental Health Awareness Campaign",
      description: "Community outreach program",
      category: "Events"
    },
    {
      title: "Mindfulness Workshop",
      description: "Group meditation session",
      category: "Workshops"
    },
    {
      title: "Support Group Meeting",
      description: "Peer support gathering",
      category: "Community"
    },
    {
      title: "Wellness Seminar",
      description: "Mental health education",
      category: "Education"
    },
    {
      title: "Art Therapy Session",
      description: "Creative healing activities",
      category: "Therapy"
    },
    {
      title: "Youth Mental Health",
      description: "School awareness program",
      category: "Youth"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Moments from our mental health awareness programs and community initiatives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Image className="h-16 w-16 text-primary/40" />
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
