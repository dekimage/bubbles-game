"use client";

import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { motion, animate, AnimatePresence } from "framer-motion";
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
import bubble4Image from "../../public/assets/main/bubble4.png";
import deckImage from "../../public/assets/props/deck.png";
import discardImage from "../../public/assets/props/discard.png";
import goldImage from "../../public/assets/main/gold.png";
import slotImage from "../../public/assets/props/leftslot.png";
import { audioManager } from "@/managers/AudioManager";
import { ITEM_IMAGES } from "@/database";

const CircularProgress = ({ current, goal }) => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const percentage = Math.min((current / goal) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine the progress color based on water level
  const progressColor = current >= goal ? "#4ade80" : "#3b82f6"; // green : blue

  return (
    <div className="relative">
      {/* Background circle */}
      <svg width="160" height="160" className="rotate-[-90deg]">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#D1E0FF"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          stroke={progressColor}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset,
            stroke: progressColor,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      {/* Water text in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div
          key={current}
          initial={{ scale: 1, color: "#D1E0FF" }}
          animate={{
            scale: [1, 1.2, 1],
            color: ["#D1E0FF", "#4ade80", "#D1E0FF"],
          }}
          transition={{
            duration: 1,
            times: [0, 0.5, 1],
            ease: "easeInOut",
          }}
          className="text-[40px] font-bold"
        >
          {current}/{goal}
        </motion.div>
        <div className="text-[16px] text-[#D1E0FF]">Clean Water</div>
      </div>

      {/* Debug Button - Only in Development */}

      <button
        onClick={() => gameStore.addWater(1000)}
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 px-2 py-1 
                     bg-blue-600 hover:bg-blue-500 rounded text-xs text-white
                     transition-colors"
      >
        CHEAT
      </button>
    </div>
  );
};

const Game = observer(() => {
  const [viewingDeck, setViewingDeck] = useState(false);
  const [viewingDiscard, setViewingDiscard] = useState(false);

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      audioManager.initialize();
      document.removeEventListener("click", handleFirstInteraction);
    };
    document.addEventListener("click", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, []);

  // Simulate volume button click
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.toggleMasterVolume();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Add this effect to manage tracks based on game state
  useEffect(() => {
    audioManager.updateTracksBasedOnLevel(gameStore.state.round);
  }, [gameStore.state.round]);

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
          <Card card={card} animate={false} isNewlyPlaced={true} />
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
      case "bubble4":
        return bubble4Image;
      default:
        return bubble1Image;
    }
  };

  return (
    <>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 flex items-center justify-center">
        <Image
          src={bgImage}
          alt="Ocean background"
          priority
          className="object-cover min-h-screen w-full"
          quality={100}
          fill
          sizes="100vw"
        />
        {/* Dark overlay when cards are displayed */}
        {gameStore.state.displayedCards.length > 0 && (
          <div className="absolute inset-0 bg-black/70 transition-opacity duration-200" />
        )}
      </div>

      {/* Main Game UI */}
      <div className="min-h-screen text-white">
        {/* Header */}
        <div className="flex justify-center w-full relative">
          <div className="absolute top-2 right-[190px] items-center justify-center flex bg-black rounded-[20px] px-4 -translate-x-1/2 drop-shadow-lg w-fit">
            <motion.div
              key={gameStore.state.pearls}
              initial={{ scale: 1, color: "#C5CFA3" }}
              animate={{
                scale: [1, 1.2, 1],
                color: ["#C5CFA3", "#4ade80", "#C5CFA3"],
              }}
              transition={{
                duration: 1,
                times: [0, 0.5, 1],
                ease: "easeInOut",
              }}
              className="text-[40px]"
            >
              {gameStore.state.pearls}
            </motion.div>
            <Image
              src={goldImage}
              alt="Gold"
              width={40}
              height={40}
              className="ml-1 w-[40px] h-[40px]"
            />
          </div>
          <div
            className="absolute top-2 right-[-80px] bg-black rounded-[20px] px-4 -translate-x-1/2 text-[40px] drop-shadow-lg w-fit"
            style={{ color: "#C5CFA3" }}
          >
            Round: {gameStore.state.round}/{gameStore.state.maxRounds}
          </div>
          <div className="flex justify-between items-center  p-4 w-fit">
            <div className="flex gap-4 absolute top-4 left-8">
              {/* Relics */}
              <div className="flex gap-2">
                {gameStore.state.relics.map((relic) => (
                  <Popover.Root key={relic.id}>
                    <Popover.Trigger asChild>
                      <div className="w-12 h-12 flex items-center justify-center bg-black rounded-[20px] cursor-pointer hover:bg-slate-600">
                        <Image
                          src={ITEM_IMAGES[relic.id]}
                          alt={relic.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
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
              <div className="flex gap-2 mr-8">
                {gameStore.state.consumables.map((consumable) => (
                  <Popover.Root key={consumable.id}>
                    <Popover.Trigger asChild>
                      <div className="w-12 h-12 flex items-center justify-center bg-black rounded-[20px] cursor-pointer hover:bg-slate-600">
                        <Image
                          src={ITEM_IMAGES[consumable.id]}
                          alt={consumable.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 object-contain"
                        />
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
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[40px]  text-white drop-shadow-lg w-fit">
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
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[40px]  text-white drop-shadow-lg w-fit">
                    {gameStore.state.discardPile.length}
                  </span>
                </motion.div>
              </div>

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
                  className={`absolute text-[20px] text-black bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-[20px]  transition-colors ${
                    !gameStore.canAdvanceRound() &&
                    "bg-gray-600 cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: gameStore.canAdvanceRound()
                      ? "#CBF24C"
                      : undefined,
                  }}
                  onClick={() => gameStore.nextRound()}
                  disabled={!gameStore.canAdvanceRound()}
                  onMouseEnter={(e) => {
                    if (gameStore.canAdvanceRound()) {
                      e.currentTarget.style.backgroundColor = "#B5DB45";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameStore.canAdvanceRound()) {
                      e.currentTarget.style.backgroundColor = "#CBF24C";
                    }
                  }}
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
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 p-2 w-fit rounded-t-[20px] z-20">
          {/* Card Selection with Next Round Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <AnimatePresence>
                {gameStore.state.displayedCards.length > 0 && (
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ y: 100, opacity: 0, scale: 0.3 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{
                      y: [0, -20, 100],
                      opacity: [1, 1, 0],
                      scale: [1, 1.1, 0.3],
                    }}
                    transition={{
                      exit: {
                        duration: 0.8,
                        times: [0, 0.3, 1],
                        ease: "easeInOut",
                        opacity: { duration: 0.3, delay: 0.5 },
                        scale: {
                          duration: 0.8,
                          ease: "backIn",
                        },
                      },
                      enter: {
                        duration: 0.8,
                        times: [0, 0.6, 0.8, 1],
                        ease: "backOut",
                        opacity: { duration: 0.3 },
                        scale: {
                          duration: 0.8,
                          ease: "backOut",
                        },
                      },
                    }}
                  >
                    {/* Card Options */}
                    <div className="flex justify-center items-center gap-4 h-48 mb-8">
                      {gameStore.state.displayedCards.map((card, index) => (
                        <div
                          key={card.id}
                          className={`transform transition-transform hover:scale-105 ${
                            index === 0
                              ? "-rotate-6 translate-y-2"
                              : index === 1
                              ? "-translate-y-4"
                              : "rotate-6 translate-y-2"
                          }`}
                        >
                          <Card
                            card={card}
                            onClick={() => gameStore.selectCard(card)}
                            fromHand={true}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Reroll Button */}
                    <motion.button
                      className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2
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
                  </motion.div>
                )}
              </AnimatePresence>
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
