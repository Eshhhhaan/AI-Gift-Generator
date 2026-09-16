import { motion } from "framer-motion";
import { Tag, IndianRupee } from "lucide-react";

export interface GiftItem {
  name: string;
  reason: string;
  price: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  Tech: "bg-gift-tech/10 text-gift-tech",
  Art: "bg-gift-art/10 text-gift-art",
  Fashion: "bg-gift-fashion/10 text-gift-fashion",
  Fitness: "bg-gift-fitness/10 text-gift-fitness",
  Food: "bg-gift-food/10 text-gift-food",
  Music: "bg-gift-music/10 text-gift-music",
  Home: "bg-gift-home/10 text-gift-home",
};

const GiftCard = ({ gift, index }: { gift: GiftItem; index: number }) => {
  const colorClass = categoryColors[gift.category] || "bg-primary/10 text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-xl p-5 gift-card-shadow bg-card border border-border hover:border-primary/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-semibold text-card-foreground text-lg leading-snug">{gift.name}</h3>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
          {gift.category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{gift.reason}</p>
      <div className="flex items-center gap-1 text-sm font-medium text-foreground">
        <IndianRupee className="w-3.5 h-3.5" />
        <span>{gift.price.replace(/₹/g, "").trim()}</span>
      </div>
    </motion.div>
  );
};

export default GiftCard;
