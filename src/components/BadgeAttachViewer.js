import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { gameStore } from "@/stores/gameStore";
import Card from "./Card";

const BadgeAttachViewer = observer(() => {
  if (!gameStore.state.badgeAttachMode) return null;

  const handleCardSelect = (card) => {
    // Only allow selecting one card
    gameStore.state.selectedCardForBadge = card;
  };

  const handleClose = (selectedCard = null) => {
    // Call the callback if it exists
    if (gameStore.state.onBadgeAttachClose) {
      gameStore.state.onBadgeAttachClose(selectedCard);
    }

    // Reset the state
    gameStore.state.badgeAttachMode = null;
    gameStore.state.selectedCardForBadge = null;
    gameStore.state.currentBadgeType = null;
    gameStore.state.onBadgeAttachClose = null;
  };

  // Get 5 random cards from the deck
  const displayedCards = gameStore.state.randomCardsForBadge || [];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            Select a card to attach {gameStore.state.currentBadgeType?.emoji}{" "}
            {gameStore.state.currentBadgeType?.name}
          </h3>
        </div>

        <div className="grid grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
          {displayedCards.map((card) => (
            <motion.div
              key={card.id}
              className={`cursor-pointer ${
                gameStore.state.selectedCardForBadge === card
                  ? "ring-2 ring-purple-500"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCardSelect(card)}
            >
              <Card card={card} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <motion.button
            className="px-6 py-3 rounded-lg font-bold bg-gray-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClose(null)}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-6 py-3 rounded-lg font-bold bg-purple-600 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClose(gameStore.state.selectedCardForBadge)}
            disabled={!gameStore.state.selectedCardForBadge}
          >
            Attach {gameStore.state.currentBadgeType?.emoji}
          </motion.button>
        </div>
      </div>
    </div>
  );
});

export default BadgeAttachViewer;
