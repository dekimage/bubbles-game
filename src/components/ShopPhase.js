import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { FaRedoAlt } from "react-icons/fa";
import { gameStore, RARITY } from "@/stores/gameStore";
import Card from "./Card";
import * as Popover from "@radix-ui/react-popover";
import ItemPopover from "./ItemPopover";

const ShopPhase = observer(() => {
  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex flex-col items-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full h-full overflow-y-auto">
        {/* Pearl Display */}
        <div className="sticky top-0 bg-slate-800 pb-4 mb-8 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Shop Phase</h2>
            <div className="flex items-center gap-8">
              <span className="text-3xl font-bold text-yellow-400">
                💎 {gameStore.state.pearls}
              </span>
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
        </div>

        {/* Shop Sections */}
        <div className="space-y-8">
          {/* Cards Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Cards</h3>
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
                No cards available. You can still reroll or proceed to next
                round.
              </div>
            )}
          </div>

          {/* Relics Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Relics ({gameStore.state.relics.length}/
              {gameStore.state.maxRelics})
            </h3>
            <div className="grid grid-cols-6 gap-4">
              {gameStore.state.shopRelics.map((relic) => (
                <Popover.Root key={relic.id}>
                  <Popover.Trigger asChild>
                    <motion.div
                      className="w-16 h-16 flex items-center justify-center bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 text-3xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      {relic.emoji}
                    </motion.div>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50" sideOffset={5}>
                      <ItemPopover
                        item={relic}
                        showBuy={true}
                        pearls={gameStore.state.pearls}
                        onBuy={() => gameStore.buyRelic(relic)}
                      />
                      <Popover.Arrow className="fill-slate-700" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              ))}
            </div>
          </div>

          {/* Consumables Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Consumables ({gameStore.state.consumables.length}/
              {gameStore.state.maxConsumables})
            </h3>
            <div className="grid grid-cols-6 gap-4">
              {gameStore.state.shopConsumables.map((consumable) => (
                <Popover.Root key={consumable.id}>
                  <Popover.Trigger asChild>
                    <motion.div
                      className="w-16 h-16 flex items-center justify-center bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 text-3xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      {consumable.emoji}
                    </motion.div>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="z-50" sideOffset={5}>
                      <ItemPopover
                        item={consumable}
                        showBuy={true}
                        pearls={gameStore.state.pearls}
                        onBuy={() => gameStore.buyConsumable(consumable)}
                      />
                      <Popover.Arrow className="fill-slate-700" />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

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

export default ShopPhase;
