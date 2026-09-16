import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const examples = [
  "Gift for my mom who loves cooking, budget ₹2000",
  "Birthday gift for a 10-year-old who loves dinosaurs, under ₹1500",
  "Anniversary gift for my partner who loves travel, budget ₹5000",
  "Gift for my friend who likes fitness and music, budget under ₹3000",
];

const HeroSection = ({ onSubmit, isLoading }: HeroSectionProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
    }
  };

  const handleExample = (text: string) => {
    setInput(text);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 hero-glow">
      <div className="max-w-3xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Gift Finder</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-foreground leading-tight mb-4">
            Find the Perfect Gift{" "}
            <br className="hidden sm:block" />
            in Seconds{" "}
            <Gift className="inline-block w-10 h-10 sm:w-12 sm:h-12 text-primary -mt-2" />
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Tell us about the person, the occasion, and your budget — our AI will recommend the ideal gifts instantly.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the person and occasion… e.g. Gift for my mom who loves cooking, budget ₹2000"
              className="flex-1 min-h-[56px] max-h-32 resize-none rounded-xl border border-input bg-popover px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="lg"
              className="rounded-xl px-6 h-14 sm:h-auto text-base font-semibold gap-2 shrink-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Thinking...
                </span>
              ) : (
                <>
                  Find Gifts
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-2 justify-center"
        >
          <span className="text-xs text-muted-foreground mr-1">Try:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleExample(ex)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
