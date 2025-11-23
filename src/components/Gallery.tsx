import meditationImage from "@/assets/gallery-meditation.jpg";
import supportImage from "@/assets/gallery-support.jpg";
import growthImage from "@/assets/gallery-growth.jpg";
import resilienceImage from "@/assets/gallery-resilience.jpg";
import feelingsImage from "@/assets/gallery-feelings.jpg";
import selfcareImage from "@/assets/gallery-selfcare.jpg";
import FeatureCarousel from "@/components/FeatureCarousel";

const Gallery = () => {
  const galleryItems = [
    {
      title: "Find Your Inner Peace",
      description: "Discover the power of meditation and mindfulness for mental clarity and emotional balance",
      image: meditationImage,
      alt: "Person meditating in peaceful nature setting"
    },
    {
      title: "You Are Not Alone",
      description: "Connect with others and build a supportive community that understands your journey",
      image: supportImage,
      alt: "Hands reaching out in support"
    },
    {
      title: "Growth Takes Time",
      description: "Embrace the journey of personal growth and celebrate every small step forward",
      image: growthImage,
      alt: "Tree with colorful leaves representing growth"
    },
    {
      title: "Be Your Own Light",
      description: "Find strength and resilience within yourself, even during challenging times",
      image: resilienceImage,
      alt: "Lighthouse standing strong"
    },
    {
      title: "Your Feelings Are Valid",
      description: "Honor your emotions and learn healthy ways to express and process them",
      image: feelingsImage,
      alt: "Colorful representation of emotions"
    },
    {
      title: "Self-Care Is Not Selfish",
      description: "Prioritize your mental health and well-being through compassionate self-care practices",
      image: selfcareImage,
      alt: "Person practicing self-care"
    }
  ];

  return (
    <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Mental Health Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Inspiring visuals and messages to support your mental wellness journey
          </p>
        </div>

        <FeatureCarousel />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-glow transition-all duration-500 border border-border/50 hover:border-primary/30"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
