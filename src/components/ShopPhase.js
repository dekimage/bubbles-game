import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { FaRedoAlt } from "react-icons/fa";
import { gameStore, RARITY } from "@/stores/gameStore";
import Card from "./Card";
import * as Popover from "@radix-ui/react-popover";
import ItemPopover from "./ItemPopover";
import CardRemovalService from "./CardRemovalService";

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
                {/* Updated Reroll Button */}
                <motion.button
                  className={`px-4 py-2 rounded-lg font-bold mb-2 flex items-center gap-2
                            ${
                              gameStore.state.pearls >=
                              gameStore.state.shopRerollCost
                                ? "bg-purple-600 hover:bg-purple-500"
                                : "bg-gray-600 cursor-not-allowed opacity-50"
                            }`}
                  whileHover={
                    gameStore.state.pearls >= gameStore.state.shopRerollCost
                      ? { scale: 1.05 }
                      : {}
                  }
                  whileTap={
                    gameStore.state.pearls >= gameStore.state.shopRerollCost
                      ? { scale: 0.95 }
                      : {}
                  }
                  onClick={() => gameStore.rerollShopCards()}
                  disabled={
                    gameStore.state.pearls < gameStore.state.shopRerollCost
                  }
                >
                  <FaRedoAlt className="animate-spin-slow" />
                  Reroll (💎 {gameStore.state.shopRerollCost})
                </motion.button>

                {/* Shop Cards */}
                <div className="flex justify-center gap-8">
                  {gameStore.state.shopDisplayedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="cursor-pointer"
                          >
                            <Card card={card} />
                          </motion.div>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content className="z-50" sideOffset={5}>
                            <ItemPopover item={card} showBuy={false} />
                            <Popover.Arrow className="fill-slate-700" />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                      <div
                        className={`flex items-center gap-1 font-bold
                                    ${
                                      gameStore.state.pearls >= card.cost
                                        ? "text-white"
                                        : "text-red-400"
                                    }`}
                      >
                        💎 {card.cost}
                      </div>
                      <motion.button
                        className={`px-4 py-1 rounded-lg font-bold text-sm
                                  ${
                                    gameStore.state.pearls >= card.cost
                                      ? "bg-purple-600 hover:bg-purple-500"
                                      : "bg-gray-600 cursor-not-allowed opacity-50"
                                  }`}
                        whileHover={
                          gameStore.state.pearls >= card.cost
                            ? { scale: 1.05 }
                            : {}
                        }
                        whileTap={
                          gameStore.state.pearls >= card.cost
                            ? { scale: 0.95 }
                            : {}
                        }
                        onClick={() => gameStore.buyShopCard(card)}
                        disabled={gameStore.state.pearls < card.cost}
                      >
                        Buy
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400">
                No cards available in shop.
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
                <div
                  key={relic.id}
                  className="flex flex-col items-center gap-2"
                >
                  <Popover.Root>
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
                        <ItemPopover item={relic} showBuy={false} />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <div
                    className={`flex items-center gap-1 font-bold
                                ${
                                  gameStore.state.pearls >= relic.cost
                                    ? "text-white"
                                    : "text-red-400"
                                }`}
                  >
                    💎 {relic.cost}
                  </div>
                  <motion.button
                    className={`px-4 py-1 rounded-lg font-bold text-sm
                              ${
                                gameStore.state.pearls >= relic.cost
                                  ? "bg-purple-600 hover:bg-purple-500"
                                  : "bg-gray-600 cursor-not-allowed opacity-50"
                              }`}
                    whileHover={
                      gameStore.state.pearls >= relic.cost
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={
                      gameStore.state.pearls >= relic.cost
                        ? { scale: 0.95 }
                        : {}
                    }
                    onClick={() => gameStore.buyRelic(relic)}
                    disabled={gameStore.state.pearls < relic.cost}
                  >
                    Buy
                  </motion.button>
                </div>
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
                <div
                  key={consumable.id}
                  className="flex flex-col items-center gap-2"
                >
                  <Popover.Root>
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
                        <ItemPopover item={consumable} showBuy={false} />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <div
                    className={`flex items-center gap-1 font-bold
                                ${
                                  gameStore.state.pearls >= consumable.cost
                                    ? "text-white"
                                    : "text-red-400"
                                }`}
                  >
                    💎 {consumable.cost}
                  </div>
                  <motion.button
                    className={`px-4 py-1 rounded-lg font-bold text-sm
                              ${
                                gameStore.state.pearls >= consumable.cost
                                  ? "bg-purple-600 hover:bg-purple-500"
                                  : "bg-gray-600 cursor-not-allowed opacity-50"
                              }`}
                    whileHover={
                      gameStore.state.pearls >= consumable.cost
                        ? { scale: 1.05 }
                        : {}
                    }
                    whileTap={
                      gameStore.state.pearls >= consumable.cost
                        ? { scale: 0.95 }
                        : {}
                    }
                    onClick={() => gameStore.buyConsumable(consumable)}
                    disabled={gameStore.state.pearls < consumable.cost}
                  >
                    Buy
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {/* Card Removal Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Card Removal Service
            </h3>
            <div className="flex items-center gap-4">
              <CardRemovalService />
              <span className="text-slate-400">
                Remove a card and upgrade another (Cost: 💎{" "}
                {gameStore.state.removalCost})
              </span>
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
