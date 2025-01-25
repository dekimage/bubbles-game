import { BADGES, gameStore } from "@/stores/gameStore";

export class EffectManager {
  static async handleConsumableEffect(consumable, targetCard = null) {
    const effect = CONSUMABLE_EFFECTS[consumable.id];
    if (!effect) {
      console.error(`No effect found for consumable: ${consumable.id}`);
      return false;
    }

    const success = await effect(targetCard);
    if (success) {
      // Remove consumable after successful use
      gameStore.removeConsumable(consumable.id);
    }
    return success;
  }

  // Common effect functions
  static async discardRandom(count) {
    const maxCount = Math.min(count, gameStore.state.mainDeck.length);
    for (let i = 0; i < maxCount; i++) {
      const randomIndex = Math.floor(
        Math.random() * gameStore.state.mainDeck.length
      );
      const card = gameStore.state.mainDeck.splice(randomIndex, 1)[0];
      gameStore.state.discardPile.push(card);
    }
    return true;
  }

  static async discardSpecific(count) {
    // Open deck viewer modal
    gameStore.state.deckViewerMode = "discard";
    gameStore.state.maxSelectableCards = count;
    gameStore.state.selectedCardsForDiscard = [];
    return new Promise((resolve) => {
      gameStore.state.onDeckViewerClose = (selectedCards) => {
        if (selectedCards) {
          selectedCards.forEach((card) => {
            gameStore.state.mainDeck = gameStore.state.mainDeck.filter(
              (c) => c.id !== card.id
            );
            gameStore.state.discardPile.push(card);
          });
          resolve(true);
        } else {
          resolve(false);
        }
      };
    });
  }

  static async attachBadge(badgeType, targetCard) {
    if (!targetCard) {
      console.error("No target card selected for badge attachment");
      return false;
    }

    if (!targetCard.upgrades) {
      targetCard.upgrades = [];
    }

    targetCard.upgrades.push({
      type: badgeType,
      emoji: BADGES[badgeType].emoji,
      name: BADGES[badgeType].name,
    });

    return true;
  }

  static async attachBadgeToDeckCard(badgeType) {
    // Set up the badge attachment mode
    gameStore.state.badgeAttachMode = true;
    gameStore.state.currentBadgeType = BADGES[badgeType];
    gameStore.state.randomCardsForBadge = gameStore.getRandomCardsFromDeck(5);

    return new Promise((resolve) => {
      gameStore.state.onBadgeAttachClose = async (selectedCard) => {
        if (selectedCard) {
          // Find the card in the main deck and attach the badge
          const cardInDeck = gameStore.state.mainDeck.find(
            (c) => c.id === selectedCard.id
          );
          if (cardInDeck) {
            await EffectManager.attachBadge(badgeType, cardInDeck);
            resolve(true);
          }
        }
        resolve(false);
      };
    });
  }

  static async reduceGoal(amount) {
    if (typeof amount === "number") {
      gameStore.reduceCurrentGoal(amount);
      return true;
    }
    return false;
  }

  static async reduceGoalRandom(min, max) {
    const reduction = Math.floor(Math.random() * (max - min + 1)) + min;
    return await this.reduceGoal(reduction);
  }

  static async addWater(amount) {
    gameStore.state.currentWater += amount;
    console.log(
      `Added ${amount} water. New total: ${gameStore.state.currentWater}`
    );
    return true;
  }

  static async addRandomWater(min, max) {
    const amount = Math.floor(Math.random() * (max - min + 1)) + min;
    return await this.addWater(amount);
  }

  static async addRerolls(amount) {
    gameStore.state.rerollsRemaining += amount;
    console.log(
      `Added ${amount} rerolls. Remaining: ${gameStore.state.rerollsRemaining}`
    );
    return true;
  }

  static async addRandomRerolls(min, max) {
    const amount = Math.floor(Math.random() * (max - min + 1)) + min;
    return await this.addRerolls(amount);
  }
}

// Helper function to create badge attachment effects
const createBadgeEffect = (badgeType) => async (targetCard) => {
  if (!gameStore.state.selectedBoardCard) {
    alert("Please select a card on the board first");
    return false;
  }
  return await EffectManager.attachBadge(
    badgeType,
    gameStore.state.selectedBoardCard
  );
};

// Define specific effects for each consumable using the helper
const CONSUMABLE_EFFECTS = {
  "chaos-whirlpool": async () => {
    return await EffectManager.discardRandom(8);
  },

  "strategic-discard": async () => {
    return await EffectManager.discardSpecific(3);
  },

  "power-badge-consumable": createBadgeEffect("RED"),
  "water-badge-consumable": createBadgeEffect("BLUE"),
  "pearl-badge-consumable": createBadgeEffect("YELLOW"),
  "magic-badge-consumable": createBadgeEffect("PURPLE"),

  "power-badge-deck-consumable": async () => {
    return await EffectManager.attachBadgeToDeckCard("RED");
  },

  "water-badge-deck-consumable": async () => {
    return await EffectManager.attachBadgeToDeckCard("BLUE");
  },

  "pearl-badge-deck-consumable": async () => {
    return await EffectManager.attachBadgeToDeckCard("YELLOW");
  },

  "magic-badge-deck-consumable": async () => {
    return await EffectManager.attachBadgeToDeckCard("PURPLE");
  },

  "minor-goal-reduction": async () => {
    return await EffectManager.reduceGoal(5);
  },

  "random-goal-reduction": async () => {
    return await EffectManager.reduceGoalRandom(2, 10);
  },

  "major-goal-reduction": async () => {
    return await EffectManager.reduceGoal(15);
  },

  // Water Effects
  "minor-water-boost": async () => {
    return await EffectManager.addWater(5);
  },
  "water-surge": async () => {
    return await EffectManager.addRandomWater(3, 12);
  },
  "major-water-boost": async () => {
    return await EffectManager.addRandomWater(5, 15);
  },

  // Reroll Effects
  "minor-reroll-boost": async () => {
    return await EffectManager.addRerolls(3);
  },
  "reroll-surge": async () => {
    return await EffectManager.addRandomRerolls(2, 5);
  },
  "major-reroll-boost": async () => {
    return await EffectManager.addRandomRerolls(4, 7);
  },

  // Add more consumable effects here
};
