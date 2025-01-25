import { makeAutoObservable } from "mobx";
import { FaRedoAlt } from "react-icons/fa";
import { EffectManager } from "@/managers/EffectManager";

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

// Add new constants
export const RARITY = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
};

const RELICS = [
  {
    id: "coral-crown",
    name: "Coral Crown",
    emoji: "👑",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "All seafolk cards gain +1 water value",
  },
  {
    id: "pearl-necklace",
    name: "Pearl Necklace",
    emoji: "📿",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "Gain 1 pearl at the start of each round",
  },
  {
    id: "ancient-compass",
    name: "Ancient Compass",
    emoji: "🧭",
    cost: 2,
    rarity: RARITY.COMMON,
    effect: "See one extra card when drawing options",
  },
  {
    id: "lucky-shell",
    name: "Lucky Shell",
    emoji: "🐚",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "First reroll each round is free",
  },
  {
    id: "merfolk-charm",
    name: "Merfolk Charm",
    emoji: "🧜‍♀️",
    cost: 5,
    rarity: RARITY.RARE,
    effect: "Machine multipliers are 0.5 higher",
  },
  {
    id: "tide-crystal",
    name: "Tide Crystal",
    emoji: "💎",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "Shop rerolls cost 0 pearls",
  },
  {
    id: "merchants-scale",
    name: "Merchant's Scale",
    emoji: "⚖️",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "All shop items cost 1 less pearl (minimum 1)",
  },
  {
    id: "coral-dice",
    name: "Coral Dice",
    emoji: "🎲",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "Each reroll has a 25% chance to be free",
  },
  {
    id: "barnacle-charm",
    name: "Barnacle Charm",
    emoji: "🪸",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "Empty slot pearl bonus is increased by 1",
  },
  {
    id: "abyssal-lens",
    name: "Abyssal Lens",
    emoji: "🔍",
    cost: 2,
    rarity: RARITY.COMMON,
    effect: "See the next card in your deck",
  },
];

const CONSUMABLES = [
  //   {
  //     id: "water-potion",
  //     name: "Water Potion",
  //     emoji: "🧪",
  //     cost: 2,
  //     rarity: RARITY.COMMON,
  //     effect: "Add 3 water to current total",
  //   },
  //   {
  //     id: "pearl-dust",
  //     name: "Pearl Dust",
  //     emoji: "✨",
  //     cost: 1,
  //     rarity: RARITY.COMMON,
  //     effect: "Gain 2 pearls immediately",
  //   },
  //   {
  //     id: "whirlpool",
  //     name: "Whirlpool",
  //     emoji: "🌀",
  //     cost: 3,
  //     rarity: RARITY.UNCOMMON,
  //     effect: "Reshuffle all cards back into deck",
  //   },
  //   {
  //     id: "treasure-map",
  //     name: "Treasure Map",
  //     emoji: "🗺️",
  //     cost: 4,
  //     rarity: RARITY.RARE,
  //     effect: "Choose any card from the deck",
  //   },
  //   {
  //     id: "mystic-conch",
  //     name: "Mystic Conch",
  //     emoji: "🐚",
  //     cost: 2,
  //     rarity: RARITY.UNCOMMON,
  //     effect: "Next card played costs no rerolls",
  //   },
  //   {
  //     id: "coral-polish",
  //     name: "Coral Polish",
  //     emoji: "✨",
  //     cost: 3,
  //     rarity: RARITY.UNCOMMON,
  //     effect: "Upgrade a random card in your hand with a badge",
  //   },
  //   {
  //     id: "merchants-pearl",
  //     name: "Merchant's Pearl",
  //     emoji: "🔮",
  //     cost: 2,
  //     rarity: RARITY.COMMON,
  //     effect: "Next shop purchase is 2 pearls cheaper",
  //   },
  //   {
  //     id: "tide-scroll",
  //     name: "Tide Scroll",
  //     emoji: "📜",
  //     cost: 3,
  //     rarity: RARITY.UNCOMMON,
  //     // effect: "Draw 3 cards, keep 1, others go to discard",
  //   },
  //   {
  //     id: "kraken-ink",
  //     name: "Kraken Ink",
  //     emoji: "🦑",
  //     cost: 4,
  //     rarity: RARITY.RARE,
  //     effect: "Double the water value of next played card",
  //   },
  //   {
  //     id: "bubble-shield",
  //     name: "Bubble Shield",
  //     emoji: "🫧",
  //     cost: 2,
  //     rarity: RARITY.COMMON,
  //     // effect: "Prevent water value from decreasing this round",
  //   },
  {
    id: "chaos-whirlpool",
    name: "Chaos Whirlpool",
    emoji: "🌪️",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "Randomly discard 8 cards from your deck",
  },
  {
    id: "strategic-discard",
    name: "Strategic Discard",
    emoji: "🎯",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "Choose 3 cards from your deck to discard",
  },
  {
    id: "power-badge-consumable",
    name: "Power Badge",
    emoji: "🔴",
    cost: 4,
    rarity: RARITY.RARE,
    effect:
      "Attach a Power Badge to a selected card on the board (+1 to value)",
    badgeType: "RED",
  },
  {
    id: "water-badge-consumable",
    name: "Water Badge",
    emoji: "🔵",
    cost: 4,
    rarity: RARITY.RARE,
    effect:
      "Attach a Water Badge to a selected card on the board (adds water synergy)",
    badgeType: "BLUE",
  },
  {
    id: "pearl-badge-consumable",
    name: "Pearl Badge",
    emoji: "🟡",
    cost: 4,
    rarity: RARITY.RARE,
    effect:
      "Attach a Pearl Badge to a selected card on the board (generates 1 pearl when played)",
    badgeType: "YELLOW",
  },
  {
    id: "magic-badge-consumable",
    name: "Magic Badge",
    emoji: "🟣",
    cost: 5,
    rarity: RARITY.RARE,
    effect:
      "Attach a Magic Badge to a selected card on the board (doubles card effect)",
    badgeType: "PURPLE",
  },
  {
    id: "power-badge-deck-consumable",
    name: "Power Badge (Deck)",
    emoji: "🎴🔴",
    cost: 3,
    rarity: RARITY.RARE,
    effect: "Attach a Power Badge to a random card in your deck (+1 to value)",
    badgeType: "RED",
  },
  {
    id: "water-badge-deck-consumable",
    name: "Water Badge (Deck)",
    emoji: "🎴🔵",
    cost: 3,
    rarity: RARITY.RARE,
    effect:
      "Attach a Water Badge to a random card in your deck (adds water synergy)",
    badgeType: "BLUE",
  },
  {
    id: "pearl-badge-deck-consumable",
    name: "Pearl Badge (Deck)",
    emoji: "🎴🟡",
    cost: 3,
    rarity: RARITY.RARE,
    effect:
      "Attach a Pearl Badge to a random card in your deck (generates 1 pearl when played)",
    badgeType: "YELLOW",
  },
  {
    id: "magic-badge-deck-consumable",
    name: "Magic Badge (Deck)",
    emoji: "🎴🟣",
    cost: 3,
    rarity: RARITY.RARE,
    effect:
      "Attach a Magic Badge to a random card in your deck (doubles card effect)",
    badgeType: "PURPLE",
  },
  {
    id: "minor-goal-reduction",
    name: "Minor Goal Reduction",
    emoji: "📉",
    cost: 3,
    rarity: RARITY.COMMON,
    effect: "Reduces current water goal by 5",
  },
  {
    id: "random-goal-reduction",
    name: "Chaotic Goal Reduction",
    emoji: "🎲",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effect: "Reduces current water goal by 2-10 (random)",
  },
  {
    id: "major-goal-reduction",
    name: "Major Goal Reduction",
    emoji: "📊",
    cost: 6,
    rarity: RARITY.RARE,
    effect: "Reduces current water goal by 15",
  },
];

export const BADGES = {
  RED: {
    type: "red",
    emoji: "🔴",
    name: "Power Badge",
    description: "Increases card value by 1",
  },
  BLUE: {
    type: "blue",
    emoji: "🔵",
    name: "Water Badge",
    description: "Adds water synergy",
  },
  YELLOW: {
    type: "yellow",
    emoji: "🟡",
    name: "Pearl Badge",
    description: "Generates 1 pearl when played",
  },
  PURPLE: {
    type: "purple",
    emoji: "🟣",
    name: "Magic Badge",
    description: "Doubles card effect",
  },
};

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
  };

  constructor() {
    makeAutoObservable(this);
    this.initializeDecks();
    // Initialize the goals array when the game starts
    this.baseGoals = Array(this.state.maxRounds)
      .fill(0)
      .map((_, index) => {
        return 20 + index * 5; // 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75
      });
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
    // If we already have displayed cards, don't allow selecting a new slot
    if (this.state.displayedCards.length > 0) return;

    this.state.selectedSlotIndex = index;
    this.drawDisplayCards();
  }

  drawDisplayCards() {
    if (this.state.selectedSlotIndex === null) return;

    const cardsNeeded = 3;
    const drawnCards = [];

    // First, try to draw as many cards as we can from current deck
    while (drawnCards.length < cardsNeeded && this.state.mainDeck.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.state.mainDeck.length
      );
      const drawnCard = this.state.mainDeck.splice(randomIndex, 1)[0];
      drawnCards.push(drawnCard);
    }

    // If we still need cards and have cards in discard
    if (drawnCards.length < cardsNeeded && this.state.discardPile.length > 0) {
      // Reshuffle discard into deck
      this.reshuffleDeckFromDiscard();

      // Draw remaining needed cards
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
    const drawnCards = [];

    // Draw cards from shop deck
    while (drawnCards.length < cardsNeeded && this.state.shopDeck.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * this.state.shopDeck.length
      );
      const drawnCard = this.state.shopDeck.splice(randomIndex, 1)[0];
      drawnCards.push(drawnCard);
    }

    this.state.shopDisplayedCards = drawnCards;
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
      this.state.displayedCards = [];
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
    if (this.canAdvanceRound()) {
      this.state.round += 1;

      // Set the original goal based on the pre-calculated array
      this.state.originalGoal = this.baseGoals[this.state.round - 1];
      // Reset current goal to match original goal for the new round
      this.state.currentGoal = this.baseGoals[this.state.round - 1];

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

      // Move all played cards to discard pile
      this.state.boardSlots.forEach((card) => {
        if (card) {
          this.state.discardPile.push(card);
        }
      });

      // Clear the board
      this.state.boardSlots = Array(10).fill(null);

      // Enter shop phase and draw initial shop cards
      this.state.isShopPhase = true;
      this.drawShopCards();
      this.drawShopItems();
    }
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

    // Save game state
    this.saveGame();
  }

  rerollShopCards() {
    // Shop rerolls always cost 1 pearl
    if (this.state.pearls < this.state.shopRerollCost) {
      console.log("Not enough pearls to reroll shop!");
      return;
    }

    // Deduct pearl cost
    this.state.pearls -= this.state.shopRerollCost;

    // Return current cards to shop deck
    this.state.shopDisplayedCards.forEach((card) => {
      this.state.shopDeck.push(card);
    });

    // Shuffle and draw new cards
    this.state.shopDeck = this.shuffleArray(this.state.shopDeck);
    this.drawShopCards();
  }

  buyShopCard(card) {
    if (this.state.pearls < card.cost) {
      console.log("Not enough pearls!");
      return;
    }

    // Deduct cost
    this.state.pearls -= card.cost;

    // Add card to discard pile
    this.state.discardPile.push(card);

    // Remove only the purchased card from displayed cards
    this.state.shopDisplayedCards = this.state.shopDisplayedCards.filter(
      (c) => c.id !== card.id
    );
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
    // Draw 3 random consumables for the shop
    const availableConsumables = [...CONSUMABLES];
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
    if (this.state.pearls < relic.cost) {
      console.log("Not enough pearls!");
      return false;
    }
    if (this.state.relics.length >= this.state.maxRelics) {
      console.log("Relic inventory full!");
      return false;
    }

    this.state.pearls -= relic.cost;
    this.state.relics.push(relic);
    this.state.shopRelics = this.state.shopRelics.filter(
      (r) => r.id !== relic.id
    );
    return true;
  }

  buyConsumable(consumable) {
    if (this.state.pearls < consumable.cost) {
      console.log("Not enough pearls!");
      return false;
    }
    if (this.state.consumables.length >= this.state.maxConsumables) {
      console.log("Consumable inventory full!");
      return false;
    }

    this.state.pearls -= consumable.cost;
    this.state.consumables.push(consumable);
    this.state.shopConsumables = this.state.shopConsumables.filter(
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
}

export const gameStore = new GameStore();
