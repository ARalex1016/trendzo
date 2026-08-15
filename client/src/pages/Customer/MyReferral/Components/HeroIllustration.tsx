import { motion } from "framer-motion";

// Icons
import { Gift, Users, Share2, TrendingUp, Wallet } from "lucide-react";

const HeroIllustration = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="relative h-64 sm:h-80 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-primary2/20 rounded-[3rem] blur-3xl" />
      <div className="relative bg-linear-to-br from-primary/10 to-primary2/10 rounded-[3rem] border border-border p-12 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-4">
          {[Gift, Users, Share2, TrendingUp, Wallet, Gift].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-pink-500/20 border border-primary/30 flex items-center justify-center"
              style={{ boxShadow: "0 0 20px rgba(168,85,247,0.2)" }}
            >
              <Icon className="w-8 h-8 text-purple-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HeroIllustration;
