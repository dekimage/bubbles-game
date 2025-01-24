import { makeAutoObservable } from "mobx";
import { FaRedoAlt } from "react-icons/fa";

// Card type constants
const CARD_TYPES = {
  SEAFOLK: "seafolk",
  MACHINE: "machine",
  ECONOMY: "economy",
  CONSUMABLE: "consumable",
};

// Suit emojis
const SUITS = {
  CORAL: "🐠", // coral suit
  SHELL: "🐚", // shell suit
  WAVE: "🌊", // wave suit
  STAR: "⭐", // star suit
};

class GameStore {
  state = {
    round: 1,
    maxRounds: 12,
    currentWater: 0,
    waterGoal: 20,
    pearls: 0,
    mainDeck: [],
    discardPile: [],
    boardSlots: Array(10).fill(null),
    enemySlots: Array(4).fill(null),
    selectedSlotIndex: null,
    displayedCards: [],
    removedFromGame: [], // For consumable cards that are removed entirely
    shopDeck: [],
    shopSlotIndex: null, // The random slot that will draw from shop deck
    pendingShopChoices: Array(10).fill(null), // Store pending shop choices for each slot
    rerollCost: 1, // Cost in pearls to reroll
  };

  constructor() {
    makeAutoObservable(this);
    this.initializeDecks();
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
    const shopDeck = [
      // Existing cards
      {
        id: `shop-seafolk-1`,
        type: CARD_TYPES.SEAFOLK,
        suit: "CORAL",
        suitEmoji: SUITS.CORAL,
        value: 6,
        waterValue: 6,
        cost: 2,
      },
      {
        id: `shop-machine-1`,
        type: CARD_TYPES.MACHINE,
        suit: "WAVE",
        suitEmoji: SUITS.WAVE,
        multiplier: 2.5,
        cost: 3,
      },
      // New additional shop cards
      {
        id: `shop-seafolk-2`,
        type: CARD_TYPES.SEAFOLK,
        suit: "STAR",
        suitEmoji: SUITS.STAR,
        value: 7,
        waterValue: 7,
        cost: 3,
      },
      {
        id: `shop-machine-2`,
        type: CARD_TYPES.MACHINE,
        suit: "SHELL",
        suitEmoji: SUITS.SHELL,
        multiplier: 3.0,
        cost: 5,
      },
      {
        id: `shop-economy-1`,
        type: CARD_TYPES.ECONOMY,
        pearlValue: 4,
        cost: 3,
      },
      {
        id: `shop-seafolk-3`,
        type: CARD_TYPES.SEAFOLK,
        suit: "WAVE",
        suitEmoji: SUITS.WAVE,
        value: 8,
        waterValue: 8,
        cost: 4,
      },
      {
        id: `shop-machine-3`,
        type: CARD_TYPES.MACHINE,
        suit: "CORAL",
        suitEmoji: SUITS.CORAL,
        multiplier: 2.0,
        cost: 2,
      },
    ];

    this.state.mainDeck = this.shuffleArray(mainDeck);
    this.state.shopDeck = this.shuffleArray(shopDeck);

    // Randomly select one slot to be the shop slot
    this.state.shopSlotIndex = Math.floor(Math.random() * 10);
  }

  createSeafolkCards() {
    const cards = [];
    const values = [1, 1, 1, 2, 2, 3, 4, 5]; // Distribution per suit

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
    const multipliers = [1.3, 1.5, 2.0];

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

  calculateWater() {
    const waterBySuit = {};
    const multipliersBySuit = {};

    // Initialize water and multipliers for each suit
    Object.keys(SUITS).forEach((suit) => {
      waterBySuit[suit] = 0;
      multipliersBySuit[suit] = 0; // Start with 0 additional percentage
    });

    // First pass: collect base values and multipliers
    this.state.boardSlots.forEach((card) => {
      if (!card) return;

      if (card.type === CARD_TYPES.SEAFOLK) {
        waterBySuit[card.suit] += card.waterValue;
      } else if (card.type === CARD_TYPES.MACHINE) {
        // Add percentage increases (1.5 means +50%, 2.0 means +100%, etc.)
        multipliersBySuit[card.suit] += card.multiplier - 1;
      }
    });

    // Calculate total water (applying multipliers)
    let totalWater = 0;
    Object.keys(SUITS).forEach((suit) => {
      const baseWater = waterBySuit[suit];
      const multiplierPercentage = multipliersBySuit[suit];
      const suitWater = baseWater * (1 + multiplierPercentage);
      totalWater += suitWater;

      // For debugging
      console.log(
        `${suit}: ${baseWater} water × (1 + ${multiplierPercentage}) = ${suitWater}`
      );
    });

    this.state.currentWater = Math.floor(totalWater);
  }

  selectSlot(index) {
    this.state.selectedSlotIndex = index;

    // Draw cards from appropriate deck
    if (index === this.state.shopSlotIndex) {
      this.drawShopCards();
    } else {
      this.drawDisplayCards();
    }
  }

  drawDisplayCards() {
    const availableCards = [...this.state.mainDeck];
    const drawnCards = [];

    for (let i = 0; i < 3 && availableCards.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      drawnCards.push(availableCards.splice(randomIndex, 1)[0]);
    }

    this.state.displayedCards = drawnCards;
  }

  drawShopCards() {
    // If we have pending choices for this slot, use those
    if (this.state.pendingShopChoices[this.state.selectedSlotIndex]) {
      this.state.displayedCards =
        this.state.pendingShopChoices[this.state.selectedSlotIndex];
      return;
    }

    // Otherwise draw new cards
    const availableCards = [...this.state.shopDeck];
    const drawnCards = [];

    for (let i = 0; i < 3 && availableCards.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      drawnCards.push(availableCards.splice(randomIndex, 1)[0]);
    }

    this.state.displayedCards = drawnCards;
    // Store these choices for later
    this.state.pendingShopChoices[this.state.selectedSlotIndex] = drawnCards;
  }

  skipShopChoice() {
    // Clear displayed cards but keep pending choices
    this.state.displayedCards = [];
    this.state.selectedSlotIndex = null;
  }

  selectCard(card) {
    if (this.state.selectedSlotIndex === null) return;

    // Check if this is a shop card (has cost property)
    if (card.cost) {
      // Check if player has enough pearls
      if (this.state.pearls < card.cost) {
        console.log("Not enough pearls!");
        return;
      }
      // Deduct the cost
      this.state.pearls -= card.cost;

      // Remove the card from shop deck
      this.state.shopDeck = this.state.shopDeck.filter((c) => c.id !== card.id);

      // Clear pending choices for this slot
      this.state.pendingShopChoices[this.state.selectedSlotIndex] = null;
    } else {
      // Remove the card from main deck
      this.state.mainDeck = this.state.mainDeck.filter((c) => c.id !== card.id);
    }

    // Place card in selected slot
    this.state.boardSlots[this.state.selectedSlotIndex] = card;

    // Handle economy cards immediately
    if (card.type === CARD_TYPES.ECONOMY) {
      this.state.pearls += card.pearlValue;
    }

    // Handle consumable cards
    if (card.type === CARD_TYPES.CONSUMABLE) {
      this.state.removedFromGame.push(card);
    } else {
      // Move unselected cards back to their respective decks
      this.state.displayedCards.forEach((c) => {
        if (c.id !== card.id) {
          if (c.cost) {
            this.state.shopDeck.push(c);
          } else {
            this.state.discardPile.push(c);
          }
        }
      });
    }

    // Clear displayed cards and selected slot
    this.state.displayedCards = [];
    this.state.selectedSlotIndex = null;

    // Recalculate water
    this.calculateWater();
  }

  saveGame() {
    localStorage.setItem("gameState", JSON.stringify(this.state));
  }

  loadGame() {
    const savedState = localStorage.getItem("gameState");
    if (savedState) {
      this.state = JSON.parse(savedState);
    }
  }

  nextRound() {
    // Move all played cards to discard pile
    this.state.boardSlots.forEach((card) => {
      if (card) {
        this.state.discardPile.push(card);
      }
    });

    // Clear the board
    this.state.boardSlots = Array(10).fill(null);

    // Clear any pending shop choices
    this.state.pendingShopChoices = Array(10).fill(null);

    // Pick new random shop slot
    this.state.shopSlotIndex = Math.floor(Math.random() * 10);

    // Update round and water goal
    this.state.round += 1;
    this.state.waterGoal += 10;

    // Reset current water
    this.state.currentWater = 0;

    // Save game state
    this.saveGame();
  }

  canAdvanceRound() {
    return this.state.currentWater >= this.state.waterGoal;
  }

  rerollCards() {
    if (this.state.pearls < this.state.rerollCost) {
      console.log("Not enough pearls to reroll!");
      return;
    }

    // Deduct reroll cost
    this.state.pearls -= this.state.rerollCost;

    // Return current displayed cards to appropriate deck
    const isShopSlot =
      this.state.selectedSlotIndex === this.state.shopSlotIndex;
    const targetDeck = isShopSlot ? this.state.shopDeck : this.state.mainDeck;

    // Put displayed cards back in deck
    this.state.displayedCards.forEach((card) => {
      targetDeck.push(card);
    });

    // Shuffle the deck
    if (isShopSlot) {
      this.state.shopDeck = this.shuffleArray(this.state.shopDeck);
    } else {
      this.state.mainDeck = this.shuffleArray(this.state.mainDeck);
    }

    // Draw new cards
    if (isShopSlot) {
      this.drawShopCards();
    } else {
      this.drawDisplayCards();
    }
  }
}

export const gameStore = new GameStore();
