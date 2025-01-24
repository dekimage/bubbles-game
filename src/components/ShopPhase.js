import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { FaRedoAlt } from "react-icons/fa";
import { gameStore } from "@/stores/gameStore";
import Card from "./Card";

const ShopPhase = observer(() => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Shop Phase</h2>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400">💎 {gameStore.state.pearls}</span>
            <motion.button
              className="px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => gameStore.finishShopping()}
            >
              Next Round
            </motion.button>
          </div>
        </div>

        {gameStore.state.shopDisplayedCards.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            {/* Reroll Button */}
            <motion.button
              className={`px-4 py-2 rounded-lg font-bold mb-2 flex items-center gap-2
                        ${
                          gameStore.canReroll()
                            ? "bg-purple-600 hover:bg-purple-500"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                        }`}
              whileHover={gameStore.canReroll() ? { scale: 1.05 } : {}}
              whileTap={gameStore.canReroll() ? { scale: 0.95 } : {}}
              onClick={() => gameStore.rerollShopCards()}
              disabled={!gameStore.canReroll()}
            >
              <FaRedoAlt className="animate-spin-slow" />
              Reroll ({gameStore.getRerollCost()})
            </motion.button>

            {/* Shop Cards */}
            <div className="flex justify-center gap-8">
              {gameStore.state.shopDisplayedCards.map((card) => (
                <motion.div
                  key={card.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => gameStore.buyShopCard(card)}
                >
                  <Card card={card} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400">
            No cards available. You can still reroll or proceed to next round.
          </div>
        )}
      </div>
    </div>
  );
});

export default ShopPhase;
