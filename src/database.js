// Card type constants
export const CARD_TYPES = {
  SEAFOLK: "seafolk",
  MACHINE: "machine",
  ECONOMY: "economy",
  CONSUMABLE: "consumable",
};

// Suit emojis
export const SUITS = {
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

export const RELICS = [
  // Water Value Boost Relics
  {
    id: "starlight-crystal",
    name: "Starlight Crystal",
    emoji: "⭐💎",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      waterBoost: 2,
      suit: SUITS.STAR,
    },
    description: "Star cards gain +2 water value",
  },
  {
    id: "wave-stone",
    name: "Wave Stone",
    emoji: "🌊💎",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      waterBoost: 2,
      suit: SUITS.WAVE,
    },
    description: "Wave cards gain +2 water value",
  },

  // Multiplier Boost Relics
  {
    id: "star-amplifier",
    name: "Star Amplifier",
    emoji: "⭐✨",
    cost: 5,
    rarity: RARITY.RARE,
    effects: {
      multiplierBoost: 0.5,
      suit: SUITS.STAR,
    },
    description: "Star multipliers give +0.5 extra",
  },

  // Extra Draw Relics
  {
    id: "fortune-compass",
    name: "Fortune Compass",
    emoji: "🧭",
    cost: 5,
    rarity: RARITY.RARE,
    effects: {
      extraDraw: 1,
    },
    description: "See 1 extra card in your choices each turn",
  },

  // Round Start Bonus Relics
  {
    id: "pearl-crown",
    name: "Pearl Crown",
    emoji: "👑",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      roundStartPearls: 1,
    },
    description: "Gain +1 pearl at the start of each round",
  },
  {
    id: "water-chalice",
    name: "Water Chalice",
    emoji: "🏺",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      roundStartWater: 2,
    },
    description: "Start each round with +2 water",
  },
  {
    id: "lucky-dice",
    name: "Lucky Dice",
    emoji: "🎲",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      roundStartRerolls: 1,
    },
    description: "Gain +1 reroll at the start of each round",
  },

  // Cost Reduction Relics
  {
    id: "merchants-pendant",
    name: "Merchant's Pendant",
    emoji: "📿",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      shopCardDiscount: 1,
    },
    description: "Cards in the shop cost 1 pearl less",
  },
  {
    id: "ancient-coin",
    name: "Ancient Coin",
    emoji: "🪙",
    cost: 5,
    rarity: RARITY.RARE,
    effects: {
      relicDiscount: 1,
    },
    description: "Relics cost 1 pearl less",
  },
  {
    id: "discount-charm",
    name: "Discount Charm",
    emoji: "🔮",
    cost: 4,
    rarity: RARITY.UNCOMMON,
    effects: {
      consumableDiscount: 1,
    },
    description: "Consumables cost 1 pearl less",
  },
];

export const CONSUMABLES = [
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
  // Direct Water Addition Consumables
  {
    id: "minor-water-boost",
    name: "Minor Water Boost",
    emoji: "💧",
    cost: 2,
    rarity: RARITY.COMMON,
    effect: "Add 5 water to current total",
  },
  {
    id: "water-surge",
    name: "Water Surge",
    emoji: "🌊",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "Add 3-12 water to current total (random)",
  },
  {
    id: "major-water-boost",
    name: "Major Water Boost",
    emoji: "🌊💧",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "Add 5-15 water to current total (random)",
  },

  // Reroll Addition Consumables
  {
    id: "minor-reroll-boost",
    name: "Minor Reroll Boost",
    emoji: "🎲",
    cost: 2,
    rarity: RARITY.COMMON,
    effect: "Add 3 rerolls",
  },
  {
    id: "reroll-surge",
    name: "Reroll Surge",
    emoji: "🎲🎯",
    cost: 3,
    rarity: RARITY.UNCOMMON,
    effect: "Add 2-5 rerolls (random)",
  },
  {
    id: "major-reroll-boost",
    name: "Major Reroll Boost",
    emoji: "🎲✨",
    cost: 4,
    rarity: RARITY.RARE,
    effect: "Add 4-7 rerolls (random)",
  },
];

import redBadgeImage from "../public/assets/icons/red.png";
import blueBadgeImage from "../public/assets/icons/blue.png";
import yellowBadgeImage from "../public/assets/icons/yellow.png";
import purpleBadgeImage from "../public/assets/icons/purple.png";

export const BADGES = {
  RED: {
    type: "RED",
    image: redBadgeImage,
    name: "Power Badge",
    description: "Triggers card effect twice",
    effect: (card, gameStore) => {
      console.log("🔴 RED BADGE: Executing card effect twice");
      gameStore.executeCardEffect(card);
      gameStore.executeCardEffect(card);
      console.log("🔴 RED BADGE: Double effect complete");
    },
  },
  BLUE: {
    type: "BLUE",
    image: blueBadgeImage,
    name: "Water Badge",
    description: "Adds +3 water when played",
    effect: (card, gameStore) => {
      console.log("🔵 BLUE BADGE: Counting blue stamp");
      runInAction(() => {
        gameStore.state.blueStampsPlayed += 1;
        console.log(
          "🔵 BLUE BADGE: Blue stamps this round:",
          gameStore.state.blueStampsPlayed
        );
      });
    },
  },
  YELLOW: {
    type: "YELLOW",
    image: yellowBadgeImage,
    name: "Pearl Badge",
    description: "Generates +2 pearls when played",
    effect: (card, gameStore) => {
      console.log("🟡 YELLOW BADGE: Adding +2 pearls");
      gameStore.state.pearls += 2;
      console.log("🟡 YELLOW BADGE: New pearl total:", gameStore.state.pearls);
    },
  },
  PURPLE: {
    type: "PURPLE",
    image: purpleBadgeImage,
    name: "Magic Badge",
    description: "Creates a copy in deck",
    effect: (card, gameStore) => {
      console.log("🟣 PURPLE BADGE: Creating card copy");
      const baseCopy = {
        ...card,
        upgrades: [],
        id: `${card.id}-copy-${Math.random()}`,
      };
      gameStore.state.mainDeck.push(baseCopy);
      gameStore.state.mainDeck = gameStore.shuffleArray(
        gameStore.state.mainDeck
      );
      console.log("🟣 PURPLE BADGE: Copy created and shuffled into deck");
    },
  },
};

export const SHOP_DECK = [
  // Existing cards
  //   {
  //     id: `shop-seafolk-1`,
  //     type: CARD_TYPES.SEAFOLK,
  //     suit: "CORAL",
  //     suitEmoji: SUITS.CORAL,
  //     value: 6,
  //     waterValue: 6,
  //     cost: 2,
  //   },
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
  // New Seafolk cards - 7 value (2 cost)
  {
    id: `shop-seafolk-coral-7`,
    type: CARD_TYPES.SEAFOLK,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    value: 7,
    waterValue: 7,
    cost: 2,
  },
  {
    id: `shop-seafolk-shell-7`,
    type: CARD_TYPES.SEAFOLK,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    value: 7,
    waterValue: 7,
    cost: 2,
  },
  {
    id: `shop-seafolk-wave-7`,
    type: CARD_TYPES.SEAFOLK,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    value: 7,
    waterValue: 7,
    cost: 2,
  },
  {
    id: `shop-seafolk-star-7`,
    type: CARD_TYPES.SEAFOLK,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    value: 7,
    waterValue: 7,
    cost: 2,
  },

  // New Seafolk cards - 10 value (3 cost)
  {
    id: `shop-seafolk-coral-10`,
    type: CARD_TYPES.SEAFOLK,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    value: 10,
    waterValue: 10,
    cost: 3,
  },
  {
    id: `shop-seafolk-shell-10`,
    type: CARD_TYPES.SEAFOLK,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    value: 10,
    waterValue: 10,
    cost: 3,
  },
  {
    id: `shop-seafolk-wave-10`,
    type: CARD_TYPES.SEAFOLK,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    value: 10,
    waterValue: 10,
    cost: 3,
  },
  {
    id: `shop-seafolk-star-10`,
    type: CARD_TYPES.SEAFOLK,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    value: 10,
    waterValue: 10,
    cost: 3,
  },

  // New Seafolk cards - 13 value (4 cost)
  {
    id: `shop-seafolk-coral-13`,
    type: CARD_TYPES.SEAFOLK,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    value: 13,
    waterValue: 13,
    cost: 4,
  },
  {
    id: `shop-seafolk-shell-13`,
    type: CARD_TYPES.SEAFOLK,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    value: 13,
    waterValue: 13,
    cost: 4,
  },
  {
    id: `shop-seafolk-wave-13`,
    type: CARD_TYPES.SEAFOLK,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    value: 13,
    waterValue: 13,
    cost: 4,
  },
  {
    id: `shop-seafolk-star-13`,
    type: CARD_TYPES.SEAFOLK,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    value: 13,
    waterValue: 13,
    cost: 4,
  },

  // New Seafolk cards - 16 value (5 cost)
  {
    id: `shop-seafolk-coral-16`,
    type: CARD_TYPES.SEAFOLK,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    value: 16,
    waterValue: 16,
    cost: 5,
  },
  {
    id: `shop-seafolk-shell-16`,
    type: CARD_TYPES.SEAFOLK,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    value: 16,
    waterValue: 16,
    cost: 5,
  },
  {
    id: `shop-seafolk-wave-16`,
    type: CARD_TYPES.SEAFOLK,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    value: 16,
    waterValue: 16,
    cost: 5,
  },
  {
    id: `shop-seafolk-star-16`,
    type: CARD_TYPES.SEAFOLK,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    value: 16,
    waterValue: 16,
    cost: 5,
  },

  // Machine cards - x3 multiplier (3 cost)
  {
    id: `shop-machine-coral-3x`,
    type: CARD_TYPES.MACHINE,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    multiplier: 3.0,
    cost: 3,
  },
  {
    id: `shop-machine-shell-3x`,
    type: CARD_TYPES.MACHINE,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    multiplier: 3.0,
    cost: 3,
  },
  {
    id: `shop-machine-wave-3x`,
    type: CARD_TYPES.MACHINE,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    multiplier: 3.0,
    cost: 3,
  },
  {
    id: `shop-machine-star-3x`,
    type: CARD_TYPES.MACHINE,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    multiplier: 3.0,
    cost: 3,
  },

  // Machine cards - x4 multiplier (5 cost)
  {
    id: `shop-machine-coral-4x`,
    type: CARD_TYPES.MACHINE,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    multiplier: 4.0,
    cost: 5,
  },
  {
    id: `shop-machine-shell-4x`,
    type: CARD_TYPES.MACHINE,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    multiplier: 4.0,
    cost: 5,
  },
  {
    id: `shop-machine-wave-4x`,
    type: CARD_TYPES.MACHINE,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    multiplier: 4.0,
    cost: 5,
  },
  {
    id: `shop-machine-star-4x`,
    type: CARD_TYPES.MACHINE,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    multiplier: 4.0,
    cost: 5,
  },

  // Machine cards - x5 multiplier (7 cost)
  {
    id: `shop-machine-coral-5x`,
    type: CARD_TYPES.MACHINE,
    suit: "CORAL",
    suitEmoji: SUITS.CORAL,
    multiplier: 5.0,
    cost: 7,
  },
  {
    id: `shop-machine-shell-5x`,
    type: CARD_TYPES.MACHINE,
    suit: "SHELL",
    suitEmoji: SUITS.SHELL,
    multiplier: 5.0,
    cost: 7,
  },
  {
    id: `shop-machine-wave-5x`,
    type: CARD_TYPES.MACHINE,
    suit: "WAVE",
    suitEmoji: SUITS.WAVE,
    multiplier: 5.0,
    cost: 7,
  },
  {
    id: `shop-machine-star-5x`,
    type: CARD_TYPES.MACHINE,
    suit: "STAR",
    suitEmoji: SUITS.STAR,
    multiplier: 5.0,
    cost: 7,
  },
];

export const ITEM_IMAGES = {
  // Relic Images
  "starlight-crystal": "/assets/relics/suit1.png",
  "wave-stone": "/assets/relics/suit2.png",
  "star-amplifier": "/assets/relics/suit3.png",
  "fortune-compass": "/assets/relics/suit4.png",
  "pearl-crown": "/assets/relics/relic1.png",
  "water-chalice": "/assets/relics/relic2.png",
  "lucky-dice": "/assets/consumables/reroll.png",
  "merchants-pendant": "/assets/relics/relic3.png",
  "ancient-coin": "/assets/relics/relic4.png",
  "discount-charm": "/assets/relics/relic2.png",

  // Consumable Images
  "chaos-whirlpool": "/assets/consumables/discard.png",
  "strategic-discard": "/assets/consumables/discard.png",
  "power-badge-consumable": "/assets/consumables/red-badge.png",
  "water-badge-consumable": "/assets/consumables/blue-badge.png",
  "pearl-badge-consumable": "/assets/consumables/yellow-badge.png",
  "magic-badge-consumable": "/assets/consumables/purple-badge.png",
  "power-badge-deck-consumable": "/assets/consumables/red-badge-deck.png",
  "water-badge-deck-consumable": "/assets/consumables/blue-badge-deck.png",
  "pearl-badge-deck-consumable": "/assets/consumables/yellow-badge-deck.png",
  "magic-badge-deck-consumable": "/assets/consumables/purple-badge-deck.png",
  "minor-goal-reduction": "/assets/consumables/goal-reduction.png",
  "random-goal-reduction": "/assets/consumables/goal-reduction.png",
  "major-goal-reduction": "/assets/consumables/goal-reduction.png",
  "minor-water-boost": "/assets/consumables/watergain2.png",
  "water-surge": "/assets/consumables/watergain.png",
  "major-water-boost": "/assets/consumables/watergain.png",
  "minor-reroll-boost": "/assets/consumables/reroll.png",
  "reroll-surge": "/assets/consumables/reroll.png",
  "major-reroll-boost": "/assets/consumables/reroll.png",
};
