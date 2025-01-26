"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { motion, animate } from "framer-motion";
import { gameStore } from "@/stores/gameStore";
import {
  FaTrashAlt,
  FaLayerGroup,
  FaGem,
  FaQuestionCircle,
  FaRedoAlt,
} from "react-icons/fa";
import Card from "./Card";
import CardViewer from "./CardViewer";
import ShopPhase from "./ShopPhase";
import * as Popover from "@radix-ui/react-popover";
import ItemPopover from "./ItemPopover";
import DeckViewer from "./DeckViewer";
import BadgeAttachViewer from "./BadgeAttachViewer";
import GameOverDialog from "./GameOverDialog";
import ResetButton from "./ResetButton";
import Image from "next/image";
import bgImage from "../../public/assets/main/bg.png";
import bubble1Image from "../../public/assets/main/bubble1.png";
import bubble2Image from "../../public/assets/main/bubble2.png";
import bubble3Image from "../../public/assets/main/bubble3.png";
import deckImage from "../../public/assets/props/deck.png";
import discardImage from "../../public/assets/props/discard.png";

import slotImage from "../../public/assets/props/leftslot.png";

const CircularProgress = ({ current, goal }) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const percentage = Math.min((current / goal) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative">
      {/* Background circle */}
      <svg width="160" height="160" className="rotate-[-90deg]">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#1a365d"
          strokeWidth="4"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#3b82f6"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      {/* Water text in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-2xl font-bold text-white">
          {current}/{goal}
        </div>
        <div className="text-sm text-blue-300">Water</div>
      </div>

      {/* Debug Button - Only in Development */}
      {isDevelopment && (
        <button
          onClick={() => gameStore.addWater(100)}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 
                     bg-blue-600 hover:bg-blue-500 rounded text-xs text-white
                     transition-colors"
        >
          +100 Water (Dev)
        </button>
      )}
    </div>
  );
};

const Game = observer(() => {
  const [viewingDeck, setViewingDeck] = useState(false);
  const [viewingDiscard, setViewingDiscard] = useState(false);

  const renderSlot = (index) => {
    const card = gameStore.state.boardSlots[index];
    const isPendingShop =
      index === gameStore.state.shopSlotIndex &&
      gameStore.state.pendingShopChoices[index];
    const isSelected = gameStore.state.selectedSlotIndex === index;
    const isBoardSelected = card && card === gameStore.state.selectedBoardCard;

    if (card) {
      return (
        <motion.div
          className={`cursor-pointer ${
            isBoardSelected ? "ring-2 ring-purple-500" : ""
          }`}
          whileHover={{ scale: 1.05 }}
          onClick={() => gameStore.selectBoardCard(index)}
        >
          <Card card={card} animate={false} />
        </motion.div>
      );
    }

    if (isPendingShop) {
      return (
        <div className="w-24 h-32 bg-yellow-600/30 rounded-lg flex flex-col items-center justify-center">
          <span className="text-4xl">?</span>
          <span className="text-2xl">💰</span>
        </div>
      );
    }

    return (
      <div
        className={`relative w-[156px] h-[168px] cursor-pointer
                    ${isSelected ? "ring-2 ring-yellow-400" : ""}`}
      >
        <Image
          src={slotImage}
          alt="Empty card slot"
          width={156}
          height={168}
          className="w-full h-full scale-[130%]"
        />
      </div>
    );
  };

  // Helper function to get the current bubble image
  const getCurrentBubbleImage = () => {
    const bubbleType = gameStore.getBubbleImage();
    switch (bubbleType) {
      case "bubble2":
        return bubble2Image;
      case "bubble3":
        return bubble3Image;
      default:
        return bubble1Image;
    }
  };

  return (
    <>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Ocean background"
          //   fill
          priority
          className="w-screen h-screen"
          quality={100}
          height={1440}
          width={2560}
        />
      </div>

      {/* Main Game UI */}
      <div className="min-h-screen text-white">
        {/* Header */}
        <div className="flex justify-center w-full">
          <div className="flex justify-between items-center  p-4 w-fit">
            <div className="flex gap-4">
              {/* Relics */}
              <div className="flex gap-2">
                {gameStore.state.relics.map((relic) => (
                  <Popover.Root key={relic.id}>
                    <Popover.Trigger asChild>
                      <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                        {relic.emoji}
                      </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50" sideOffset={5}>
                        <ItemPopover item={relic} />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                ))}
              </div>
              {/* Consumables */}
              <div className="flex gap-2">
                {gameStore.state.consumables.map((consumable) => (
                  <Popover.Root key={consumable.id}>
                    <Popover.Trigger asChild>
                      <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                        {consumable.emoji}
                      </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content className="z-50" sideOffset={5}>
                        <ItemPopover
                          item={consumable}
                          isConsumable={true}
                          onUse={() => gameStore.useConsumable(consumable)}
                        />
                        <Popover.Arrow className="fill-slate-700" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                ))}
              </div>
            </div>

            <div>
              Round: {gameStore.state.round}/{gameStore.state.maxRounds}
            </div>

            <div className="flex items-center gap-4">
              {/* Deck and Discard buttons */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewingDeck(true)}
                >
                  <Image
                    src={deckImage}
                    alt="View deck"
                    width={64}
                    height={64}
                    priority
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white drop-shadow-lg w-fit">
                    {gameStore.state.mainDeck.length}
                  </span>
                </motion.div>

                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewingDiscard(true)}
                >
                  <Image
                    src={discardImage}
                    alt="View discard"
                    width={64}
                    height={64}
                    priority
                  />
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white drop-shadow-lg">
                    {gameStore.state.discardPile.length}
                  </span>
                </motion.div>
              </div>

              <div>Rerolls: {gameStore.state.rerollsRemaining}</div>
              <ResetButton />
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          {/* Card Slots */}
          <div className="flex justify-between items-center mx-32">
            {/* Left Slots */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              {/* Top two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(0, 2).map((_, index) => (
                  <div
                    key={`left-${index}`}
                    className={`${
                      !gameStore.state.boardSlots[index] && "rounded-[20px]"
                    } rounded-lg cursor-pointer
                            ${
                              gameStore.state.selectedSlotIndex === index
                                ? "ring-2 ring-yellow-400"
                                : ""
                            }`}
                    onClick={() =>
                      !gameStore.state.boardSlots[index] &&
                      gameStore.selectSlot(index)
                    }
                  >
                    {renderSlot(index)}
                  </div>
                ))}
              </div>
              {/* Middle card */}
              <div
                className={`${
                  !gameStore.state.boardSlots[2] && " rounded-[20px]"
                } rounded-lg cursor-pointer ml-12
                        ${
                          gameStore.state.selectedSlotIndex === 2
                            ? "ring-2 ring-yellow-400"
                            : ""
                        }`}
                onClick={() =>
                  !gameStore.state.boardSlots[2] && gameStore.selectSlot(2)
                }
              >
                {renderSlot(2)}
              </div>
              {/* Bottom two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(3, 5).map((_, index) => (
                  <div
                    key={`left-${index + 3}`}
                    className={`${
                      !gameStore.state.boardSlots[index + 3] && ""
                    } rounded-lg cursor-pointer
                            ${
                              gameStore.state.selectedSlotIndex === index + 3
                                ? "ring-2 ring-yellow-400"
                                : ""
                            }`}
                    onClick={() =>
                      !gameStore.state.boardSlots[index + 3] &&
                      gameStore.selectSlot(index + 3)
                    }
                  >
                    {renderSlot(index + 3)}
                  </div>
                ))}
              </div>
            </div>

            {/* Center Bubble with Progress and End Round Button */}
            <div className="flex-grow flex justify-center items-center px-8">
              <div className="relative w-[400px] h-[400px] flex-shrink-0">
                <Image
                  src={getCurrentBubbleImage()}
                  alt="Toxic bubble"
                  className="object-contain"
                  priority
                  width={400}
                  height={400}
                />
                {/* Circular Progress */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <CircularProgress
                    current={gameStore.state.currentWater}
                    goal={gameStore.state.currentGoal}
                  />
                </div>
                {/* End Round Button */}
                <button
                  className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 ${
                    gameStore.canAdvanceRound()
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-gray-600 cursor-not-allowed"
                  } rounded-lg font-bold transition-colors`}
                  onClick={() => gameStore.nextRound()}
                  disabled={!gameStore.canAdvanceRound()}
                >
                  End Round
                </button>
              </div>
            </div>

            {/* Right Slots */}
            <div className="flex flex-col items-center gap-4 flex-shrink-0">
              {/* Top two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(5, 7).map((_, index) => (
                  <div
                    key={`right-${index}`}
                    className={`${
                      !gameStore.state.boardSlots[index + 5] && ""
                    } rounded-lg cursor-pointer
                            ${
                              gameStore.state.selectedSlotIndex === index + 5
                                ? "ring-2 ring-yellow-400"
                                : ""
                            }`}
                    onClick={() =>
                      !gameStore.state.boardSlots[index + 5] &&
                      gameStore.selectSlot(index + 5)
                    }
                  >
                    {renderSlot(index + 5)}
                  </div>
                ))}
              </div>
              {/* Middle card */}
              <div
                className={`${
                  !gameStore.state.boardSlots[7] && ""
                } rounded-lg cursor-pointer ml-12
                        ${
                          gameStore.state.selectedSlotIndex === 7
                            ? "ring-2 ring-yellow-400"
                            : ""
                        }`}
                onClick={() =>
                  !gameStore.state.boardSlots[7] && gameStore.selectSlot(7)
                }
              >
                {renderSlot(7)}
              </div>
              {/* Bottom two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(8, 10).map((_, index) => (
                  <div
                    key={`right-${index + 8}`}
                    className={`${
                      !gameStore.state.boardSlots[index + 8] && ""
                    } rounded-lg cursor-pointer
                            ${
                              gameStore.state.selectedSlotIndex === index + 8
                                ? "ring-2 ring-yellow-400"
                                : ""
                            }`}
                    onClick={() =>
                      !gameStore.state.boardSlots[index + 8] &&
                      gameStore.selectSlot(index + 8)
                    }
                  >
                    {renderSlot(index + 8)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-slate-800 p-2 w-fit rounded-t-lg">
          {/* Card Selection with Next Round Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {gameStore.state.displayedCards.length > 0 && (
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
                    onClick={() => gameStore.rerollCards()}
                    disabled={!gameStore.canReroll()}
                  >
                    <FaRedoAlt className="animate-spin-slow" />
                    Reroll ({gameStore.getRerollCost()})
                  </motion.button>

                  {/* Card Options */}
                  <div className="flex justify-center gap-4">
                    {gameStore.state.displayedCards.map((card) => (
                      <Card
                        key={card.id}
                        card={card}
                        onClick={() => gameStore.selectCard(card)}
                      />
                    ))}
                  </div>

                  {/* Skip button for shop choices */}
                  {gameStore.state.selectedSlotIndex ===
                    gameStore.state.shopSlotIndex && (
                    <motion.button
                      className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => gameStore.skipShopChoice()}
                    >
                      Skip (Decide Later)
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Viewers */}
      <CardViewer
        isOpen={viewingDeck}
        onClose={() => setViewingDeck(false)}
        cards={gameStore.state.mainDeck}
        title="Main Deck"
      />

      <CardViewer
        isOpen={viewingDiscard}
        onClose={() => setViewingDiscard(false)}
        cards={gameStore.state.discardPile}
        title="Discard Pile"
      />

      {/* Shop Phase Overlay */}
      {gameStore.state.isShopPhase && <ShopPhase />}
      <DeckViewer />
      <BadgeAttachViewer />
      <GameOverDialog />
    </>
  );
});

export default Game;
