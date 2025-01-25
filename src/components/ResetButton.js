import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { gameStore } from "@/stores/gameStore";

const ResetButton = () => {
  return (
    <motion.button
      className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => gameStore.restartGame()}
    >
      <FiRefreshCw size={16} className="text-slate-300" />
    </motion.button>
  );
};

export default ResetButton;
