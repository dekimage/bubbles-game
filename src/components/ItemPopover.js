import { motion } from "framer-motion";
import { RARITY } from "@/stores/gameStore";

const ItemPopover = ({
  item,
  onUse,
  onBuy,
  showBuy = false,
  isConsumable = false,
  pearls = 0,
}) => {
  const canAfford = pearls >= (item.cost || 0);

  return (
    <div className="bg-slate-700 p-4 rounded-lg w-64">
      <div className="text-4xl mb-2">{item.emoji}</div>
      <div className="font-bold text-white">{item.name}</div>
      <div className="text-sm text-slate-300 mb-2">{item.effect}</div>
      <div className="flex justify-between items-center mb-2">
        <div className={`text-xs ${getRarityColor(item.rarity)}`}>
          {item.rarity.toUpperCase()}
        </div>
        {showBuy && <div className="text-yellow-400">💎 {item.cost}</div>}
      </div>
      {showBuy && (
        <motion.button
          className={`w-full px-4 py-2 rounded-lg font-bold text-white mb-2
                    ${
                      canAfford
                        ? "bg-purple-600 hover:bg-purple-500"
                        : "bg-gray-600 cursor-not-allowed opacity-50"
                    }`}
          whileHover={canAfford ? { scale: 1.05 } : {}}
          whileTap={canAfford ? { scale: 0.95 } : {}}
          onClick={onBuy}
          disabled={!canAfford}
        >
          Buy
        </motion.button>
      )}
      {isConsumable && (
        <motion.button
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUse}
        >
          Use
        </motion.button>
      )}
    </div>
  );
};

const getRarityColor = (rarity) => {
  switch (rarity) {
    case RARITY.RARE:
      return "text-purple-400";
    case RARITY.UNCOMMON:
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
};

export default ItemPopover;
