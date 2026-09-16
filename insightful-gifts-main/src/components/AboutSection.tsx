import { motion } from "framer-motion";
import { Brain, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "NLP-Based Understanding",
    description: "Our AI understands natural language — just describe the person, occasion, and budget in your own words.",
  },
  {
    icon: Heart,
    title: "Personalized Suggestions",
    description: "Every recommendation is tailored to the recipient's interests, making each gift meaningful and thoughtful.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get curated gift ideas in seconds — no endless browsing, no decision fatigue.",
  },
];

const AboutSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          InstantGift AI uses advanced language understanding to turn your description into perfect gift recommendations.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center p-6 rounded-2xl bg-card border border-border"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
