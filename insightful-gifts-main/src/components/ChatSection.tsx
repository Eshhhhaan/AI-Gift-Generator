import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Msg, streamChat } from "@/lib/streamChat";
import GiftCard, { GiftItem } from "./GiftCard";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface ChatSectionProps {
  initialMessage?: string;
}

function parseGifts(text: string): { gifts: GiftItem[]; cleanText: string } {
  const giftBlockRegex = /```gifts\s*\n([\s\S]*?)\n```/g;
  const gifts: GiftItem[] = [];
  let cleanText = text;

  let match;
  while ((match = giftBlockRegex.exec(text)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        gifts.push(...parsed);
      }
    } catch { /* ignore parse errors */ }
    cleanText = cleanText.replace(match[0], "");
  }

  return { gifts, cleanText: cleanText.trim() };
}

interface ChatMessage extends Msg {
  gifts?: GiftItem[];
}

const ChatSection = ({ initialMessage }: ChatSectionProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (initialMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages: Msg[] = [...messages.map(m => ({ role: m.role, content: m.content })), { role: "user" as const, content: text }];

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      const { gifts, cleanText } = parseGifts(assistantSoFar);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        const msg: ChatMessage = { role: "assistant", content: assistantSoFar, gifts: gifts.length > 0 ? gifts : undefined };
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? msg : m));
        }
        return [...prev, msg];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast.error(error);
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to get recommendations. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
    }
  };

  return (
    <section id="chat" className="max-w-3xl mx-auto px-4 pb-8">
      <div ref={scrollRef} className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 ${msg.role === "user" ? "chat-bubble-user rounded-br-md" : "chat-bubble-ai rounded-bl-md"}`}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-card-foreground">
                      <ReactMarkdown>{parseGifts(msg.content).cleanText}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === "assistant" && msg.gifts && msg.gifts.length > 0 && (
                  <div className="mt-3 grid gap-3">
                    {msg.gifts.map((gift, gi) => (
                      <GiftCard key={gi} gift={gift} index={gi} />
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="chat-bubble-ai rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {messages.length > 0 && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for more suggestions or refine your search..."
            className="flex-1 min-h-[48px] max-h-24 resize-none rounded-xl border border-input bg-popover px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
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
            size="icon"
            className="rounded-xl h-12 w-12 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      )}
    </section>
  );
};

export default ChatSection;
