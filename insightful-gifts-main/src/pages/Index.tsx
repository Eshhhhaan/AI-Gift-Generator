import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ChatSection from "@/components/ChatSection";
import AboutSection from "@/components/AboutSection";
import { Gift } from "lucide-react";

const Index = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const handleHeroSubmit = (text: string) => {
    setInitialMessage(text);
    setChatStarted(true);
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">InstantGift</span>
          </div>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </a>
        </div>
      </nav>

      <div className="pt-14">
        {!chatStarted && <HeroSection onSubmit={handleHeroSubmit} isLoading={false} />}

        {chatStarted && (
          <div ref={chatRef} className="pt-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Gift className="w-4 h-4 text-primary" />
                <span>InstantGift AI</span>
              </div>
            </div>
            <ChatSection initialMessage={initialMessage} />
          </div>
        )}

        <div id="about">
          <AboutSection />
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by InstantGift AI — Find the perfect gift, every time.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
