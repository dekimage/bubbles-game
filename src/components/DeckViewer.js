import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { gameStore } from "@/stores/gameStore";
import Card from "./Card";

const DeckViewer = observer(() => {
  if (!gameStore.state.deckViewerMode) return null;

  const handleCardSelect = (card) => {
    const selected = gameStore.state.selectedCardsForDiscard;
    if (selected.includes(card)) {
      gameStore.state.selectedCardsForDiscard = selected.filter(
        (c) => c !== card
      );
    } else if (selected.length < gameStore.state.maxSelectableCards) {
      gameStore.state.selectedCardsForDiscard.push(card);
    }
  };

  const handleClose = (selectedCards = null) => {
    // Call the callback if it exists
    if (gameStore.state.onDeckViewerClose) {
      gameStore.state.onDeckViewerClose(selectedCards);
    }

    // Reset the deck viewer state
    gameStore.state.deckViewerMode = null;
    gameStore.state.selectedCardsForDiscard = [];
    gameStore.state.maxSelectableCards = 0;
    gameStore.state.onDeckViewerClose = null;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            Select cards to discard (
            {gameStore.state.selectedCardsForDiscard.length}/
            {gameStore.state.maxSelectableCards})
          </h3>
        </div>

        <div className="grid grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
          {gameStore.state.mainDeck.map((card) => (
            <motion.div
              key={card.id}
              className={`cursor-pointer ${
                gameStore.state.selectedCardsForDiscard.includes(card)
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
            className="px-6 py-3 rounded-lg font-bold bg-purple-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClose(gameStore.state.selectedCardsForDiscard)}
          >
            Confirm
          </motion.button>
        </div>
      </div>
    </div>
  );
});

export default DeckViewer;
