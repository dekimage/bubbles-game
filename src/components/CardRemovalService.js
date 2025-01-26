import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { gameStore } from "@/stores/gameStore";
import Card from "./Card";
import Image from "next/image";
import { BADGES } from "@/database";

const CardRemovalService = observer(() => {
  if (!gameStore.state.cardRemovalOptions.length) {
    return (
      <motion.button
        className="w-16 h-16 flex items-center justify-center bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 text-3xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => gameStore.startCardRemoval()}
        disabled={gameStore.state.pearls < gameStore.state.removalCost}
      >
        🔨
      </motion.button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            {gameStore.state.badgeApplicationMode
              ? "Choose a card to receive the gem"
              : "Choose a card to remove"}
          </h3>
          {gameStore.state.badgeApplicationMode && (
            <div className="text-xl flex items-center justify-center gap-2 text-white text-center">
              Apply Gem:
              <div className="">
                <Image
                  src={BADGES[gameStore.state.currentBadge.type].image}
                  alt={BADGES[gameStore.state.currentBadge.type].name}
                  width={32}
                  height={32}
                  className="w-[75px] h-[75px]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {gameStore.state.cardRemovalOptions.map((card) => (
            <motion.div
              key={card.id}
              className="relative cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (gameStore.state.badgeApplicationMode) {
                  gameStore.applyBadge(card.id);
                } else {
                  gameStore.removeCard(card.id);
                }
              }}
            >
              <Card card={card} fromHand />
              {/* Show existing badges if any */}
              {card.upgrades && card.upgrades.length > 0 && (
                <div className="absolute top-0 right-0 flex gap-1 p-1">
                  {card.upgrades.map((badge, index) => (
                    <span key={index} className="text-lg">
                      {badge.emoji}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default CardRemovalService;
