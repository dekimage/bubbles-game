import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { gameStore } from "@/stores/gameStore";
import { audioManager } from "@/managers/AudioManager";

const ResetButton = () => {
  return (
    <div className="flex gap-2">
      <motion.button
        className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => gameStore.restartGame()}
      >
        <FiRefreshCw size={16} className="text-slate-300" />
      </motion.button>

      <motion.button
        className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => audioManager.toggleMasterVolume()}
      >
        {audioManager.isMuted ? (
          <FiVolumeX size={16} className="text-slate-300" />
        ) : (
          <FiVolume2 size={16} className="text-slate-300" />
        )}
      </motion.button>
    </div>
  );
};

export default ResetButton;
