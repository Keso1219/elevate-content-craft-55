import { Upload, Search, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Knowledge",
    description: "Add your PDFs, documents, and content that represents your expertise and brand voice.",
    color: "from-primary to-primary/80"
  },
  {
    icon: Search,
    title: "Scrape Inspiration",
    description: "Select creators and platforms you admire. We'll analyze their content style and approach.",
    color: "from-accent to-accent/80"
  },
  {
    icon: Sparkles,
    title: "Generate & Elevate",
    description: "Chat with Elev8 to create personalized content that combines your knowledge with proven styles.",
    color: "from-primary to-accent"
  }
];

export const ProcessSteps = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Simple Steps to
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Content Excellence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your content creation process with AI that learns from the best while staying true to your unique voice.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="card-feature text-center group">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-elegant group-hover:shadow-lg transition-all duration-200`}>
                <step.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              <div className="mt-4 text-primary font-medium text-sm">
                Step {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};