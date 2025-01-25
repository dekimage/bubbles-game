"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";
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
import { RelicManager } from "@/managers/RelicManager";

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
        className={`w-24 h-32 bg-slate-800 rounded-lg
                    ${
                      index === gameStore.state.shopSlotIndex
                        ? "border-2 border-yellow-500"
                        : ""
                    }
                    ${isSelected ? "ring-2 ring-yellow-400" : ""}`}
      />
    );
  };

  return (
    <>
      {/* Main Game UI */}
      <div className="min-h-screen bg-slate-900 text-white p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-lg">
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

          <div className="flex items-center gap-2">
            <div
              className={`font-bold ${
                gameStore.state.currentWater >= gameStore.state.currentGoal
                  ? "text-green-400"
                  : "text-white"
              }`}
            >
              Water: {gameStore.state.currentWater}/
              {gameStore.state.currentGoal}
            </div>
            {process.env.NODE_ENV === "development" && (
              <motion.button
                className="px-2 py-1 bg-blue-600 rounded text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => (gameStore.state.currentWater += 20)}
              >
                +20
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div>Pearls: {gameStore.state.pearls}</div>
            {process.env.NODE_ENV === "development" && (
              <motion.button
                className="px-2 py-1 bg-yellow-600 rounded text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => (gameStore.state.pearls += 20)}
              >
                +20
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div>Rerolls: {gameStore.state.rerollsRemaining}</div>
          </div>
        </div>

        {/* Update goal display */}
        <div className="flex items-center gap-2 text-xl">
          <span>Goal: {gameStore.state.currentGoal} water</span>
          {gameStore.state.currentGoal !== gameStore.state.originalGoal && (
            <span className="text-gray-400 text-sm">
              (Original: {gameStore.state.originalGoal})
            </span>
          )}
        </div>

        {/* Game Board */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Bubble */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-48 h-48 bg-blue-900/30 rounded-full flex flex-wrap justify-center items-center gap-2 p-4"
          >
            {gameStore.state.enemySlots.map((_, index) => (
              <div
                key={`enemy-${index}`}
                className="w-16 h-16 bg-red-900/30 rounded-lg border border-red-500/30"
              />
            ))}
          </div>

          {/* Card Slots */}
          <div className="flex justify-center gap-32">
            {/* Left Slots */}
            <div className="flex flex-col items-center gap-4">
              {/* Top two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(0, 2).map((_, index) => (
                  <div
                    key={`left-${index}`}
                    className={`${
                      !gameStore.state.boardSlots[index] && "bg-slate-800"
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
                  !gameStore.state.boardSlots[2] && "bg-slate-800"
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
                      !gameStore.state.boardSlots[index + 3] && "bg-slate-800"
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

            {/* Right Slots */}
            <div className="flex flex-col items-center gap-4">
              {/* Top two cards */}
              <div className="flex gap-4">
                {gameStore.state.boardSlots.slice(5, 7).map((_, index) => (
                  <div
                    key={`right-${index}`}
                    className={`${
                      !gameStore.state.boardSlots[index + 5] && "bg-slate-800"
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
                  !gameStore.state.boardSlots[7] && "bg-slate-800"
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
                      !gameStore.state.boardSlots[index + 8] && "bg-slate-800"
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
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 p-4">
          {/* Button Bar */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
            <motion.button
              className="flex flex-col items-center justify-center w-16 h-16 bg-slate-700 
                       rounded-lg hover:bg-slate-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewingDiscard(true)}
            >
              <FaTrashAlt className="text-xl mb-1" />
              <span className="text-xs">
                Discard ({gameStore.state.discardPile.length})
              </span>
            </motion.button>

            <motion.button
              className="flex flex-col items-center justify-center w-16 h-16 bg-slate-700 
                       rounded-lg hover:bg-slate-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewingDeck(true)}
            >
              <FaLayerGroup className="text-xl mb-1" />
              <span className="text-xs">
                Deck ({gameStore.state.mainDeck.length})
              </span>
            </motion.button>
          </div>

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

            {/* Next Round Button */}
            <button
              className={`px-6 py-2 ${
                gameStore.canAdvanceRound()
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-gray-600 cursor-not-allowed"
              } rounded-lg font-bold`}
              onClick={() => gameStore.nextRound()}
              disabled={!gameStore.canAdvanceRound()}
            >
              End Round
            </button>
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
    </>
  );
});

export default Game;
