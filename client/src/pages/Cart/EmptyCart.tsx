import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

// Icons
import { ShoppingBag } from "lucide-react";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#1A1A1D] border border-[#2A2A2E] flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <ShoppingBag className="w-12 h-12 text-[#8B5CF6]" />
          </div>
        </div>
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(139,92,246,0.3)",
              "0 0 40px rgba(139,92,246,0.5)",
              "0 0 20px rgba(139,92,246,0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl text-[#F5F5F5] mb-3"
      >
        Your cart is empty
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[#9CA3AF] mb-8 text-center max-w-md"
      >
        Looks like you haven't added anything to your cart yet. Start shopping
        to fill it up!
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigate("/products");
        }}
        className="px-8 py-4 bg-linear-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
      >
        Continue Shopping
      </motion.button>
    </div>
  );
};

export default EmptyCart;
