import { motion } from "framer-motion";
import { gameStore } from "@/stores/gameStore";

const GameOverDialog = () => {
  if (!gameStore.state.isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 p-12 rounded-lg text-center max-w-lg"
      >
        <h1 className="text-5xl font-bold text-red-500 mb-6">END OF GAME</h1>
        <p className="text-gray-400 text-xl mb-8">
          You failed to clean the ocean from this toxic bubble :(
        </p>
        <motion.button
          className="px-8 py-4 bg-blue-600 rounded-lg text-white font-bold text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => gameStore.startNewGame()}
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default GameOverDialog;
