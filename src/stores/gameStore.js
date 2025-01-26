import { makeAutoObservable, action, runInAction } from "mobx";
import { FaRedoAlt } from "react-icons/fa";
import { EffectManager } from "@/managers/EffectManager";
import { RelicManager } from "@/managers/RelicManager";
import {
  BADGES,
  CARD_TYPES,
  CONSUMABLES,
  RELICS,
  SHOP_DECK,
  SUITS,
} from "@/database";

class GameStore {
  state = {
    round: 1,
    maxRounds: 12,
    currentWater: 0,
    originalGoal: 20, // Starting goal
    currentGoal: 20, // Current (possibly reduced) goal
    pearls: 0,
    mainDeck: [],
    discardPile: [],
    boardSlots: Array(10).fill(null),
    enemySlots: Array(4).fill(null),
    selectedSlotIndex: null,
    displayedCards: [],
    removedFromGame: [], // For consumable cards that are removed entirely
    shopDeck: [],
    isShopPhase: false, // Whether we're in the shop phase
    shopDisplayedCards: [], // Cards displayed in shop phase
    rerollCost: 1, // Cost in pearls to reroll
    rerollsRemaining: 5, // Rerolls per round
    pearlRerollCost: 1, // Cost in pearls to reroll when out of rerolls
    waterGoalIncrement: 5, // How much water goal increases per round
    relics: [], // Owned relics
    consumables: [], // Owned consumables
    shopRelics: [], // Currently displayed relics in shop
    shopConsumables: [], // Currently displayed consumables in shop
    maxRelics: 5, // Updated from 3 to 5
    maxConsumables: 5, // Updated from 4 to 5
    removalCost: 3, // Cost in pearls for removal service
    cardRemovalOptions: [], // Cards shown for removal
    selectedCardForRemoval: null, // Card selected to be removed
    badgeApplicationMode: false, // Whether we're choosing a card to badge
    currentBadge: null, // Badge to be applied
    shopRerollCost: 1, // Always costs 1 pearl to reroll in shop
    selectedBoardCard: null,
    deckViewerMode: null, // 'discard' | null
    maxSelectableCards: 0,
    selectedCardsForDiscard: [],
    onDeckViewerClose: null,
    badgeAttachMode: null,
    selectedCardForBadge: null,
    currentBadgeType: null,
    onBadgeAttachClose: null,
    randomCardsForBadge: [],
    availableRelics: [...RELICS],
    availableConsumables: [...CONSUMABLES],
    blueStampsPlayed: 0, // Track blue stamps played this round
  };

  constructor() {
    makeAutoObservable(this);

    // Try to load saved game, if none exists start new game
    if (!this.loadGame()) {
      this.startNewGame();
    }
  }

  initializeDecks() {
    // Initialize main deck
    const mainDeck = [
      ...this.createSeafolkCards(),
      ...this.createMachineCards(),
      ...this.createEconomyCards(),
      ...this.createConsumableCards(),
    ];

    // Extended shop deck with more cards

    this.state.mainDeck = this.shuffleArray(mainDeck);
    this.state.shopDeck = this.shuffleArray(SHOP_DECK);
  }

  createSeafolkCards() {
    const cards = [];
    const values = [1, 2, 3, 4, 5]; // One of each value per suit

    Object.entries(SUITS).forEach(([suitName, suitEmoji]) => {
      values.forEach((value) => {
        cards.push({
          id: `seafolk-${suitName}-${value}-${Math.random()}`,
          type: CARD_TYPES.SEAFOLK,
          suit: suitName,
          suitEmoji,
          value,
          waterValue: value,
        });
      });
    });

    return cards;
  }

  createMachineCards() {
    const cards = [];
    const multipliers = [1.5, 2.0, 3.0];

    Object.entries(SUITS).forEach(([suitName, suitEmoji]) => {
      multipliers.forEach((multiplier) => {
        cards.push({
          id: `machine-${suitName}-${multiplier}-${Math.random()}`,
          type: CARD_TYPES.MACHINE,
          suit: suitName,
          suitEmoji,
          multiplier,
        });
      });
    });

    return cards;
  }

  createEconomyCards() {
    const pearlValues = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3];
    return pearlValues.map((value) => ({
      id: `economy-${value}-${Math.random()}`,
      type: CARD_TYPES.ECONOMY,
      pearlValue: value,
    }));
  }

  createConsumableCards() {
    // We can add these later
    return [];
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  calculateWater = action("calculateWater", () => {
    const waterBySuit = {};
    const multipliersBySuit = {};

    // Initialize water and multipliers for each suit
    Object.keys(SUITS).forEach((suit) => {
      waterBySuit[suit] = 0;
      multipliersBySuit[suit] = 0;
    });

    // First pass: collect base values and multipliers
    this.state.boardSlots.forEach((card) => {
      if (!card) return;

      if (card.type === CARD_TYPES.SEAFOLK) {
        let baseValue = card.waterValue;

        // Check for suit-specific value relics
        this.state.relics.forEach((relic) => {
          if (relic.id === "starlight-crystal" && card.suit === "STAR") {
            baseValue += 2;
          }
          if (relic.id === "wave-pendant" && card.suit === "WAVE") {
            // Changed from wave-stone to wave-pendant
            baseValue += 2;
          }
          if (relic.id === "coral-crown" && card.suit === "CORAL") {
            // Changed from coral-stone to coral-crown
            baseValue += 2;
          }
          if (relic.id === "shell-charm" && card.suit === "SHELL") {
            // Changed from shell-stone to shell-charm
            baseValue += 2;
          }
        });

        waterBySuit[card.suit] += baseValue;
      } else if (card.type === CARD_TYPES.MACHINE) {
        let multiplierBonus = card.multiplier - 1; // Convert 2.0 to 1.0 for percentage

        // Check for suit-specific multiplier relics
        this.state.relics.forEach((relic) => {
          if (relic.id === "star-amplifier" && card.suit === "STAR") {
            multiplierBonus += 0.5;
          }
          if (relic.id === "wave-amplifier" && card.suit === "WAVE") {
            multiplierBonus += 0.5;
          }
          if (relic.id === "coral-amplifier" && card.suit === "CORAL") {
            multiplierBonus += 0.5;
          }
          if (relic.id === "shell-amplifier" && card.suit === "SHELL") {
            multiplierBonus += 0.5;
          }
        });

        multipliersBySuit[card.suit] += multiplierBonus;
      }
    });

    // Calculate total water (applying multipliers)
    let totalWater = 0;
    Object.keys(SUITS).forEach((suit) => {
      const baseWater = waterBySuit[suit];
      const multiplierPercentage = multipliersBySuit[suit];
      const suitWater = baseWater * (1 + multiplierPercentage);
      totalWater += suitWater;

      //   console.log(
      //     `${suit}: ${baseWater} water × (1 + ${multiplierPercentage}) = ${suitWater}`
      //   );
    });

    // Add blue stamp bonus
    const blueStampBonus = this.state.blueStampsPlayed * 3;
    totalWater += blueStampBonus;
    // console.log(
    //   `Blue stamp bonus: ${this.state.blueStampsPlayed} stamps × 3 = +${blueStampBonus} water`
    // );

    runInAction(() => {
      this.state.currentWater = Math.floor(totalWater);
    });
  });

  selectSlot(index) {
    // If we already have displayed cards, don't allow selecting a new slot
    if (this.state.displayedCards.length > 0) return;

    this.state.selectedSlotIndex = index;
    this.drawDisplayCards();
  }

  drawDisplayCards() {
    if (this.state.selectedSlotIndex === null) return;

    // Get base number of cards plus any extras from relics
    const baseCards = 3;
    const extraCards = RelicManager.getExtraDrawCount();
    const cardsNeeded = baseCards + extraCards;

    const drawnCards = [];

    // Draw cards logic remains the same, just with modified cardsNeeded
    while (drawnCards.length < cardsNeeded && this.state.mainDeck.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.state.mainDeck.length
      );
      const drawnCard = this.state.mainDeck.splice(randomIndex, 1)[0];
      drawnCards.push(drawnCard);
    }

    if (drawnCards.length < cardsNeeded && this.state.discardPile.length > 0) {
      this.reshuffleDeckFromDiscard();
      while (
        drawnCards.length < cardsNeeded &&
        this.state.mainDeck.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * this.state.mainDeck.length
        );
        const drawnCard = this.state.mainDeck.splice(randomIndex, 1)[0];
        drawnCards.push(drawnCard);
      }
    }

    this.state.displayedCards = drawnCards;
  }

  drawShopCards() {
    const cardsNeeded = 3;
    console.log("Shop deck size before drawing:", this.state.shopDeck.length);

    // Clear displayed cards first
    const currentDisplayed = [...this.state.shopDisplayedCards];
    this.state.shopDisplayedCards = [];

    // Return displayed cards to deck only if they're not already there
    currentDisplayed.forEach((card) => {
      if (!this.state.shopDeck.some((deckCard) => deckCard.id === card.id)) {
        this.state.shopDeck.push(card);
      }
    });

    // Shuffle the deck
    this.state.shopDeck = this.shuffleArray(this.state.shopDeck);

    // Draw new cards
    const drawnCards = [];
    while (drawnCards.length < cardsNeeded && this.state.shopDeck.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.state.shopDeck.length
      );
      const drawnCard = this.state.shopDeck.splice(randomIndex, 1)[0];
      drawnCards.push(drawnCard);
    }

    console.log(
      `Drew ${drawnCards.length} shop cards from deck of ${this.state.shopDeck.length} cards`
    );
    this.state.shopDisplayedCards = drawnCards;
  }

  skipShopChoice() {
    // Clear displayed cards but keep pending choices
    this.state.displayedCards = [];
    this.state.selectedSlotIndex = null;
  }

  buyCard(card) {
    // Check if this is a shop card (has cost property)
    if (!card.cost) return;

    // Check if player has enough pearls
    if (this.state.pearls < card.cost) {
      console.log("Not enough pearls!");
      return;
    }

    // Deduct the cost
    this.state.pearls -= card.cost;

    // Remove the card from shop deck
    this.state.shopDeck = this.state.shopDeck.filter((c) => c.id !== card.id);

    // Handle consumable cards
    if (card.type === CARD_TYPES.CONSUMABLE) {
      this.state.removedFromGame.push(card);
    } else {
      // Move card to discard pile (main deck)
      this.state.discardPile.push(card);
    }

    // Return other displayed shop cards to shop deck
    this.state.shopDisplayedCards.forEach((c) => {
      if (c.id !== card.id) {
        this.state.shopDeck.push(c);
      }
    });

    // Clear displayed shop cards
    this.state.shopDisplayedCards = [];
  }

  selectCard(card) {
    if (this.state.selectedSlotIndex === null) return;

    // Remove the card from main deck
    this.state.mainDeck = this.state.mainDeck.filter((c) => c.id !== card.id);

    // Place card in selected slot
    this.state.boardSlots[this.state.selectedSlotIndex] = card;

    // Execute card effects (including badges)
    this.executeCardEffect(card);

    // Move unselected cards to discard pile
    this.state.displayedCards.forEach((c) => {
      if (c.id !== card.id) {
        this.state.discardPile.push(c);
      }
    });

    // Clear displayed cards and selected slot
    this.state.displayedCards = [];
    this.state.selectedSlotIndex = null;

    // Recalculate water
    this.calculateWater();
  }

  saveGame() {
    try {
      const gameState = JSON.stringify(this.state);
      localStorage.setItem("oceanCleanerGameState", gameState);
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }

  loadGame() {
    try {
      const savedState = localStorage.getItem("oceanCleanerGameState");
      if (savedState) {
        this.state = JSON.parse(savedState);
        return true;
      }
    } catch (error) {
      // If there's an error loading, we'll just start a new game
    }
    return false;
  }

  getBaseRerolls() {
    let baseRerolls = 5;

    // Add permanent reroll bonuses from relics
    this.state.relics.forEach((relic) => {
      if (relic.effects?.roundStartRerolls) {
        baseRerolls += relic.effects.roundStartRerolls;
      }
    });

    return baseRerolls;
  }

  // This is called when clicking "End Round" button in the main game
  nextRound() {
    if (this.canAdvanceRound()) {
      // Count empty slots and award bonus pearls
      const emptySlots = this.state.boardSlots.filter(
        (slot) => slot === null
      ).length;
      const pearlBonus = emptySlots * 2;

      if (pearlBonus > 0) {
        this.state.pearls += pearlBonus;
        console.log(
          `Bonus pearls for efficiency: +${pearlBonus} 💎 (${emptySlots} empty slots)`
        );
      }

      // Reset water to 0 first
      this.state.currentWater = 0;

      // Return any displayed shop cards back to deck before entering shop phase
      this.state.shopDisplayedCards.forEach((card) => {
        if (!this.state.shopDeck.some((deckCard) => deckCard.id === card.id)) {
          this.state.shopDeck.push(card);
        }
      });
      this.state.shopDisplayedCards = [];

      // Enter shop phase and draw all shop items
      this.state.isShopPhase = true;
      this.drawShopCards();
      this.drawShopItems();
      this.drawShopRelics();
    }
  }

  // This is called when clicking "Next Round" button in the shop phase
  endShopPhase() {
    runInAction(() => {
      // First do the regular shop cleanup
      this.finishShopping();

      // Then apply relic effects
      this.state.relics.forEach((relic) => {
        if (relic.effects?.roundStartRerolls) {
          const bonus = relic.effects.roundStartRerolls;
          this.state.rerollsRemaining += bonus;
          console.log(
            `Added ${bonus} rerolls. New total: ${this.state.rerollsRemaining}`
          );
        }

        if (relic.effects?.roundStartWater) {
          const bonus = relic.effects.roundStartWater;
          this.state.currentWater += bonus;
          console.log(
            `Added ${bonus} water. New total: ${this.state.currentWater}`
          );
        }

        if (relic.effects?.roundStartPearls) {
          const bonus = relic.effects.roundStartPearls;
          this.state.pearls += bonus;
          console.log(`Added ${bonus} pearls. New total: ${this.state.pearls}`);
        }

        this.saveGame();
      });
    });
  }

  canAdvanceRound() {
    return this.state.currentWater >= this.state.currentGoal;
  }

  rerollCards() {
    // Check if we can reroll
    if (
      this.state.rerollsRemaining === 0 &&
      this.state.pearls < this.state.pearlRerollCost
    ) {
      console.log("Not enough rerolls or pearls!");
      return;
    }

    // Use reroll or deduct pearl
    if (this.state.rerollsRemaining > 0) {
      this.state.rerollsRemaining--;
    } else {
      this.state.pearls -= this.state.pearlRerollCost;
    }

    // Move current displayed cards to discard pile
    this.state.displayedCards.forEach((card) => {
      this.state.discardPile.push(card);
    });

    // Clear displayed cards
    this.state.displayedCards = [];

    // Draw new cards (will handle reshuffling if needed)
    this.drawDisplayCards();
  }

  canReroll() {
    return (
      this.state.rerollsRemaining > 0 ||
      this.state.pearls >= this.state.pearlRerollCost
    );
  }

  getRerollCost() {
    return this.state.rerollsRemaining > 0
      ? `${this.state.rerollsRemaining} left`
      : `💎${this.state.pearlRerollCost}`;
  }

  // Add method to finish shopping and start next round
  finishShopping() {
    runInAction(() => {
      // Return any remaining shop cards to deck before clearing
      this.state.shopDisplayedCards.forEach((card) => {
        if (!this.state.shopDeck.some((deckCard) => deckCard.id === card.id)) {
          this.state.shopDeck.push(card);
        }
      });

      // Move all board cards to discard pile
      this.state.boardSlots.forEach((card) => {
        if (card) {
          this.state.discardPile.push(card);
        }
      });

      // Clear board slots
      this.state.boardSlots = Array(10).fill(null);

      // Clear shop state
      this.state.shopDisplayedCards = [];
      this.state.isShopPhase = false;

      // Update round and water goal
      this.state.round += 1;
      this.state.currentGoal += this.state.waterGoalIncrement;

      // Reset current water
      this.state.currentWater = 0;

      // Reset rerolls
      this.state.rerollsRemaining = 5;

      // Reset blue stamps counter
      this.state.blueStampsPlayed = 0;

      // Save game state
      this.saveGame();
    });
  }

  rerollShopCards() {
    // Shop rerolls always cost 1 pearl
    if (this.state.pearls < this.state.shopRerollCost) {
      console.log("Not enough pearls to reroll shop!");
      return;
    }

    // Deduct pearl cost
    this.state.pearls -= this.state.shopRerollCost;

    // Return current displayed cards to shop deck
    this.state.shopDisplayedCards.forEach((card) => {
      this.state.shopDeck.push(card);
    });

    // Shuffle and draw new cards
    this.state.shopDeck = this.shuffleArray(this.state.shopDeck);
    this.drawShopCards();
  }

  buyShopCard(card) {
    const finalCost = RelicManager.getFinalCost("shopCard", card.cost);

    if (this.state.pearls < finalCost) {
      console.log("Not enough pearls!");
      return false;
    }

    this.state.pearls -= finalCost;
    this.state.discardPile.push(card); // Add to main deck's discard pile

    // Remove only the bought card from shop display
    this.state.shopDisplayedCards = this.state.shopDisplayedCards.filter(
      (c) => c.id !== card.id
    );

    // Remove the bought card from shop deck permanently
    this.state.shopDeck = this.state.shopDeck.filter((c) => c.id !== card.id);

    return true;
  }

  reshuffleDeckFromDiscard() {
    // Move all cards from discard to deck
    this.state.mainDeck = [...this.state.mainDeck, ...this.state.discardPile];
    // Clear discard pile
    this.state.discardPile = [];
    // Shuffle the new deck
    this.state.mainDeck = this.shuffleArray(this.state.mainDeck);
  }

  drawShopItems() {
    // Draw 3 random consumables from available ones instead of all CONSUMABLES
    const availableConsumables = [...this.state.availableConsumables];
    this.state.shopConsumables = [];

    for (let i = 0; i < 3; i++) {
      if (availableConsumables.length === 0) break;
      const randomIndex = Math.floor(
        Math.random() * availableConsumables.length
      );
      const consumable = availableConsumables.splice(randomIndex, 1)[0];
      this.state.shopConsumables.push(consumable);
    }
  }

  buyRelic(relic) {
    const finalCost = RelicManager.getFinalCost("relic", relic.cost);

    if (this.state.pearls < finalCost) {
      console.log("Not enough pearls!");
      return false;
    }
    if (this.state.relics.length >= this.state.maxRelics) {
      console.log("Relic inventory full!");
      return false;
    }

    this.state.pearls -= finalCost;
    this.state.relics.push(relic);
    this.state.shopRelics = this.state.shopRelics.filter(
      (r) => r.id !== relic.id
    );

    // Remove from available relics
    this.state.availableRelics = this.state.availableRelics.filter(
      (r) => r.id !== relic.id
    );

    // Immediately apply effects
    if (relic.effects?.roundStartRerolls) {
      const bonus = relic.effects.roundStartRerolls;
      this.state.rerollsRemaining += bonus;
      console.log(
        `Added ${bonus} rerolls. New total: ${this.state.rerollsRemaining}`
      );
    }

    if (relic.effects?.roundStartWater) {
      const bonus = relic.effects.roundStartWater;
      this.state.currentWater += bonus;
      console.log(
        `Added ${bonus} water. New total: ${this.state.currentWater}`
      );
    }

    if (relic.effects?.roundStartPearls) {
      const bonus = relic.effects.roundStartPearls;
      this.state.pearls += bonus;
      console.log(`Added ${bonus} pearls. New total: ${this.state.pearls}`);
    }

    return true;
  }

  buyConsumable(consumable) {
    const finalCost = RelicManager.getFinalCost("consumable", consumable.cost);

    if (this.state.pearls < finalCost) {
      console.log("Not enough pearls!");
      return false;
    }
    if (this.state.consumables.length >= this.state.maxConsumables) {
      console.log("Consumable inventory full!");
      return false;
    }

    this.state.pearls -= finalCost;
    this.state.consumables.push(consumable);
    this.state.shopConsumables = this.state.shopConsumables.filter(
      (c) => c.id !== consumable.id
    );

    // Remove from available consumables
    this.state.availableConsumables = this.state.availableConsumables.filter(
      (c) => c.id !== consumable.id
    );

    return true;
  }

  startCardRemoval() {
    if (this.state.pearls < this.state.removalCost) {
      console.log("Not enough pearls!");
      return;
    }

    // Draw 5 cards for removal options
    const drawnCards = [];

    // Try to draw from main deck first
    while (drawnCards.length < 5 && this.state.mainDeck.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.state.mainDeck.length
      );
      const card = this.state.mainDeck.splice(randomIndex, 1)[0];
      drawnCards.push(card);
    }

    // If we need more cards, reshuffle discard and continue drawing
    if (drawnCards.length < 5 && this.state.discardPile.length > 0) {
      this.reshuffleDeckFromDiscard();

      while (drawnCards.length < 5 && this.state.mainDeck.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * this.state.mainDeck.length
        );
        const card = this.state.mainDeck.splice(randomIndex, 1)[0];
        drawnCards.push(card);
      }
    }

    this.state.cardRemovalOptions = drawnCards;
  }

  removeCard(cardId) {
    // Deduct cost
    this.state.pearls -= this.state.removalCost;

    // Find and remove the selected card
    const removedCardIndex = this.state.cardRemovalOptions.findIndex(
      (c) => c.id === cardId
    );
    if (removedCardIndex === -1) return;

    // Remove the card from options
    this.state.cardRemovalOptions.splice(removedCardIndex, 1);

    // Generate random badge
    const badgeTypes = Object.values(BADGES);
    this.state.currentBadge =
      badgeTypes[Math.floor(Math.random() * badgeTypes.length)];

    // Enter badge application mode
    this.state.badgeApplicationMode = true;
  }

  applyBadge(cardId) {
    if (!this.state.currentBadge || !this.state.badgeApplicationMode) return;

    // Find the card to upgrade
    const cardToUpgrade = this.state.cardRemovalOptions.find(
      (c) => c.id === cardId
    );
    if (!cardToUpgrade) return;

    // Initialize upgrades array if it doesn't exist
    if (!cardToUpgrade.upgrades) {
      cardToUpgrade.upgrades = [];
    }

    // Add the badge
    cardToUpgrade.upgrades.push(this.state.currentBadge);

    // Return remaining cards to deck
    this.state.cardRemovalOptions.forEach((card) => {
      this.state.mainDeck.push(card);
    });

    // Clear removal state
    this.state.cardRemovalOptions = [];
    this.state.currentBadge = null;
    this.state.badgeApplicationMode = false;
  }

  selectBoardCard(index) {
    const card = this.state.boardSlots[index];
    if (!card) return;

    // Toggle selection
    if (this.state.selectedBoardCard === card) {
      this.state.selectedBoardCard = null;
    } else {
      this.state.selectedBoardCard = card;
    }
  }

  async useConsumable(consumable) {
    const badgeConsumableIds = [
      "power-badge-consumable",
      "water-badge-consumable",
      "pearl-badge-consumable",
      "magic-badge-consumable",
    ];

    if (
      badgeConsumableIds.includes(consumable.id) &&
      this.state.selectedBoardCard
    ) {
      // If it's one of our specific badge consumables and we have a selected board card
      this.applyBadgeFromConsumable(
        { type: consumable.badgeType },
        this.state.selectedBoardCard
      );
      // Remove the used consumable
      this.removeConsumable(consumable.id);
      // Clear selection
      this.state.selectedBoardCard = null;
      return true;
    }

    // Handle other consumable types via EffectManager
    const success = await EffectManager.handleConsumableEffect(
      consumable,
      this.state.selectedBoardCard
    );

    if (success) {
      // Clear selection after successful use
      this.state.selectedBoardCard = null;
    }
  }

  removeConsumable(consumableId) {
    this.state.consumables = this.state.consumables.filter(
      (c) => c.id !== consumableId
    );
  }

  // Add helper method to get random cards
  getRandomCardsFromDeck(count) {
    const deck = [...this.state.mainDeck];
    const result = [];
    const maxCount = Math.min(count, deck.length);

    for (let i = 0; i < maxCount; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      result.push(deck.splice(randomIndex, 1)[0]);
    }

    return result;
  }

  // Update goal setting to use both values
  setNextGoal() {
    this.state.originalGoal += 5;
    this.state.currentGoal = this.state.originalGoal;
  }

  // Add method to reduce current goal
  reduceCurrentGoal(amount) {
    // Only reduce the current goal, never affecting the original
    this.state.currentGoal = Math.max(1, this.state.currentGoal - amount);
    console.log(
      `Goal reduced by ${amount}. Current goal: ${this.state.currentGoal} (Original: ${this.state.originalGoal})`
    );
  }

  drawShopRelics() {
    // Draw 3 random relics from available ones instead of all RELICS
    const availableRelics = [...this.state.availableRelics];
    this.state.shopRelics = [];

    for (let i = 0; i < 3; i++) {
      if (availableRelics.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableRelics.length);
      const relic = availableRelics.splice(randomIndex, 1)[0];
      this.state.shopRelics.push(relic);
    }
  }

  executeCardEffect(card) {
    runInAction(() => {
      if (card.upgrades && card.upgrades.length > 0) {
        card.upgrades.forEach((badge) => {
          const badgeType = BADGES[badge.type.toUpperCase()];
          if (badgeType && badgeType.effect) {
            badgeType.effect(card, this);
          }
        });
      }

      if (card.type === CARD_TYPES.SEAFOLK) {
        // Water value handled by calculateWater
      } else if (card.type === CARD_TYPES.MACHINE) {
        // Multiplier handled by calculateWater
      } else if (card.type === CARD_TYPES.ECONOMY) {
        this.state.pearls += card.pearlValue;
      }

      this.calculateWater();

      // Add only this new check for game over
      const filledSlots = this.state.boardSlots.filter(
        (slot) => slot !== null
      ).length;
      if (filledSlots === 10) {
        this.checkIfLose();
      }
    });
  }

  playCard(card, slotIndex) {
    runInAction(() => {
      // Place card in slot
      this.state.boardSlots[slotIndex] = card;

      // Remove from displayed cards
      this.state.displayedCards = this.state.displayedCards.filter(
        (c) => c.id !== card.id
      );

      // Execute card effects (including badges)
      this.executeCardEffect(card);

      // Clear selection
      this.state.selectedSlotIndex = null;
    });
  }

  applyBadgeFromConsumable(badge, card) {
    // Initialize upgrades array if it doesn't exist
    if (!card.upgrades) {
      card.upgrades = [];
    }

    // Add the badge
    card.upgrades.push(badge);

    // Immediately trigger the badge effect since it's from a consumable
    const badgeType = BADGES[badge.type.toUpperCase()];
    if (badgeType && badgeType.effect) {
      console.log(
        "Triggering immediate badge effect from consumable:",
        badgeType.name
      );
      badgeType.effect(card, this);
    }

    // Recalculate water since badge might have affected it
    this.calculateWater();
  }

  checkIfLose() {
    if (this.state.currentWater < this.state.currentGoal) {
      this.state.isGameOver = true;
    }
  }

  startNewGame() {
    runInAction(() => {
      // Reset all state to initial values
      this.state = {
        round: 1,
        maxRounds: 9, // Changed from 12 to 9
        currentWater: 0,
        originalGoal: 20,
        currentGoal: 20,
        pearls: 0,
        mainDeck: [],
        discardPile: [],
        boardSlots: Array(10).fill(null),
        enemySlots: Array(4).fill(null),
        selectedSlotIndex: null,
        displayedCards: [],
        removedFromGame: [],
        shopDeck: [],
        isShopPhase: false,
        shopDisplayedCards: [],
        rerollCost: 1,
        rerollsRemaining: 5,
        pearlRerollCost: 1,
        waterGoalIncrement: 5,
        relics: [],
        consumables: [],
        shopRelics: [],
        shopConsumables: [],
        maxRelics: 5,
        maxConsumables: 5,
        removalCost: 3,
        cardRemovalOptions: [],
        selectedCardForRemoval: null,
        badgeApplicationMode: false,
        currentBadge: null,
        shopRerollCost: 1,
        selectedBoardCard: null,
        deckViewerMode: null,
        maxSelectableCards: 0,
        selectedCardsForDiscard: [],
        onDeckViewerClose: null,
        badgeAttachMode: null,
        selectedCardForBadge: null,
        currentBadgeType: null,
        onBadgeAttachClose: null,
        randomCardsForBadge: [],
        availableRelics: [...RELICS],
        availableConsumables: [...CONSUMABLES],
        blueStampsPlayed: 0,
        isGameOver: false,
      };

      // Initialize decks using existing method
      this.initializeDecks();

      // Initialize the goals array
      this.baseGoals = Array(this.state.maxRounds)
        .fill(0)
        .map((_, index) => {
          return 20 + index * 5;
        });
    });
  }

  restartGame() {
    // Clear saved game state
    localStorage.removeItem("oceanCleanerGameState");

    // Start fresh game
    this.startNewGame();
  }

  // Helper to determine which bubble image to show
  getBubbleImage() {
    const round = this.state.round;
    if (round <= 3) return "bubble1";
    if (round <= 6) return "bubble2";
    return "bubble3";
  }

  addWater(amount) {
    console.log("AAAA", amount);
    runInAction(() => {
      this.state.currentWater += amount;
      // Recalculate water after adding
    });
  }
}

export const gameStore = new GameStore();
