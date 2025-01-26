import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
import { FaRedoAlt } from "react-icons/fa";
import { gameStore } from "@/stores/gameStore";
import Card from "./Card";
import * as Popover from "@radix-ui/react-popover";
import ItemPopover from "./ItemPopover";
import CardRemovalService from "./CardRemovalService";
import { RelicManager } from "@/managers/RelicManager";
import { RARITY, ITEM_IMAGES } from "@/database";
import Image from "next/image";
import shopImage from "../../public/assets/main/shop.png";
import goldImage from "../../public/assets/main/gold.png";

const ShopPhase = observer(() => {
  const renderPrice = (item, type, onClick) => {
    const basePrice = item.cost;
    const finalPrice = RelicManager.getFinalCost(type, basePrice);
    const canAfford = gameStore.state.pearls >= finalPrice;

    const priceButton = (price) => (
      <motion.button
        className={`flex text-white text-[24px] items-center gap-1 px-4 py-2 rounded-[20px] ${
          canAfford
            ? "bg-yellow-400 hover:bg-yellow-300"
            : "bg-gray-600 opacity-50"
        }`}
        whileHover={canAfford ? { scale: 1.05 } : {}}
        whileTap={canAfford ? { scale: 0.95 } : {}}
        onClick={canAfford ? onClick : undefined}
        disabled={!canAfford}
      >
        <span className={canAfford ? "text-black font-bold" : "text-gray-300"}>
          {price}
        </span>
        <Image
          src={goldImage}
          alt="Gold"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </motion.button>
    );

    if (finalPrice < basePrice) {
      return (
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-400">
            {priceButton(basePrice)}
          </span>
          {priceButton(finalPrice)}
        </div>
      );
    }

    return priceButton(finalPrice);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-[100vw] max-h-[140vh] bg-slate-800/90 rounded-lg p-8 overflow-y-auto relative">
        {/* Pearl Display */}
        <div className="mb-8 sticky top-4 flex justify-center z-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center bg-slate-900/90 rounded-[20px] p-2 backdrop-blur-sm">
                <span className="text-3xl font-bold text-yellow-400">
                  {gameStore.state.pearls}
                </span>
                <Image
                  src={goldImage}
                  alt="Gold"
                  width={32}
                  height={32}
                  className="ml-1 w-8 h-8"
                />
              </div>
              <motion.button
                className="px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => gameStore.endShopPhase()}
              >
                Next Round
              </motion.button>
            </div>
          </div>
        </div>

        {/* Shop Sections */}
        <div className="space-y-8 z-10 relative flex justify-center items-center flex-col">
          {/* Add background image here */}
          <div className="fixed inset-0 w-full h-full -z-10">
            <Image
              src="/assets/main/shopbg2.png"
              alt="Shop background"
              fill
              priority
              className="object-cover bg-black/90 opacity-20"
            />
          </div>

          {/* Cards Section */}
          <div className="space-y-4 ">
            {gameStore.state.shopDisplayedCards.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                {/* Reroll Button */}
                <motion.button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold
                            ${
                              gameStore.state.pearls >=
                              gameStore.state.shopRerollCost
                                ? "bg-yellow-400 hover:bg-yellow-300"
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
                  <span
                    className={
                      gameStore.state.pearls >= gameStore.state.shopRerollCost
                        ? "text-black"
                        : "text-gray-300"
                    }
                  >
                    {gameStore.state.shopRerollCost}
                  </span>
                  <Image
                    src={goldImage}
                    alt="Gold"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </motion.button>

                {/* Shop Cards */}
                <div className="flex justify-center gap-8">
                  {gameStore.state.shopDisplayedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                      >
                        <Card card={card} fromHand />
                      </motion.div>
                      {renderPrice(card, "shopCard", () =>
                        gameStore.buyShopCard(card)
                      )}
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
          <div className="space-y-4 ">
            <h3 className="text-xl font-bold text-white text-center">
              Relics ({gameStore.state.relics.length}/
              {gameStore.state.maxRelics})
            </h3>
            <div className="flex flex-wrap justify-center gap-24">
              {gameStore.state.shopRelics.map((relic) => (
                <div
                  key={relic.id}
                  className="flex flex-col items-center gap-6"
                >
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <motion.div
                        className="w-16 h-16 flex items-center justify-center bg-slate-700 rounded-[20px] cursor-pointer hover:bg-slate-600"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image
                          src={ITEM_IMAGES[relic.id]}
                          alt={relic.name}
                          width={48}
                          height={48}
                          className="w-20 h-20 object-contain"
                        />
                      </motion.div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50" sideOffset={5}>
                        <ItemPopover item={relic} showBuy={false} />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  {renderPrice(relic, "relic", () => gameStore.buyRelic(relic))}
                </div>
              ))}
            </div>
          </div>

          {/* Consumables Section */}
          <div className="space-y-4 ">
            <h3 className="text-xl font-bold text-white text-center">
              Consumables ({gameStore.state.consumables.length}/
              {gameStore.state.maxConsumables})
            </h3>
            <div className="flex flex-wrap justify-center gap-24">
              {gameStore.state.shopConsumables.map((consumable) => (
                <div
                  key={consumable.id}
                  className="flex flex-col items-center gap-6"
                >
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <motion.div
                        className="w-16 h-16 flex items-center justify-center bg-slate-700 rounded-[20px] cursor-pointer hover:bg-slate-600"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Image
                          src={ITEM_IMAGES[consumable.id]}
                          alt={consumable.name}
                          width={48}
                          height={48}
                          className="w-20 h-20 object-contain"
                        />
                      </motion.div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50" sideOffset={5}>
                        <ItemPopover item={consumable} showBuy={false} />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  {renderPrice(consumable, "consumable", () =>
                    gameStore.buyConsumable(consumable)
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Removal Service */}
          <div className="space-y-4  flex justify-center">
            <div className="flex items-center gap-4 border border-black rounded-[20px] bg-slate-600 p-4">
              <CardRemovalService />
              <span className="text-slate-400 flex items-center gap-2">
                Remove a card and upgrade another{" "}
                <span className="text-white text-[20px]">
                  {/* ({gameStore.state.removalCost}) */}3
                </span>
                <Image
                  src={goldImage}
                  alt="Gold"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
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
