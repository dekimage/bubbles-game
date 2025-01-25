import { gameStore } from "@/stores/gameStore";

export class RelicManager {
  static isFirstDrawOfRound = true;

  // Card Value Modifiers
  static getWaterValueModifier(card) {
    let modifier = 0;

    gameStore.state.relics.forEach((relic) => {
      // Check if relic has water boost effect and matches the card's suit
      if (relic.effects?.waterBoost && relic.effects.suit === card.suit) {
        modifier += relic.effects.waterBoost;
        console.log(
          `🌊 Relic ${relic.name} adding +${relic.effects.waterBoost} water to ${card.suit} card`
        );
      }
    });

    return modifier;
  }

  static getMultiplierModifier(card) {
    let modifier = 0;

    gameStore.state.relics.forEach((relic) => {
      // Suit-specific multiplier boosts
      if (relic.effects?.multiplierBoost && card.suit === relic.effects.suit) {
        modifier += relic.effects.multiplierBoost;
      }
    });

    return modifier;
  }

  // Round Start Effects
  static getExtraDrawCount() {
    if (!this.isFirstDrawOfRound) return 0;

    let extraCards = 0;
    gameStore.state.relics.forEach((relic) => {
      if (relic.effects?.extraDraw) {
        extraCards += relic.effects.extraDraw;
      }
    });

    this.isFirstDrawOfRound = false;
    return extraCards;
  }

  static getRoundStartBonuses() {
    let bonuses = {
      pearls: 0,
      water: 0,
      rerolls: 0,
    };

    gameStore.state.relics.forEach((relic) => {
      if (relic.effects?.roundStartPearls) {
        bonuses.pearls += relic.effects.roundStartPearls;
      }
      if (relic.effects?.roundStartWater) {
        bonuses.water += relic.effects.roundStartWater;
      }
      if (relic.effects?.roundStartRerolls) {
        bonuses.rerolls += relic.effects.roundStartRerolls;
      }
    });

    return bonuses;
  }

  // Cost Reduction Effects
  static getCostReduction(type, basePrice) {
    let reduction = 0;

    gameStore.state.relics.forEach((relic) => {
      switch (type) {
        case "shopCard":
          if (relic.effects?.shopCardDiscount) {
            reduction += relic.effects.shopCardDiscount;
          }
          break;
        case "relic":
          if (relic.effects?.relicDiscount) {
            reduction += relic.effects.relicDiscount;
          }
          break;
        case "consumable":
          if (relic.effects?.consumableDiscount) {
            reduction += relic.effects.consumableDiscount;
          }
          break;
      }
    });

    // Ensure price doesn't go below 1
    return Math.min(reduction, basePrice - 1);
  }

  // Helper method to apply all round start effects
  static applyRoundStartEffects() {
    const bonuses = this.getRoundStartBonuses();

    if (bonuses.pearls > 0) {
      gameStore.state.pearls += bonuses.pearls;
      console.log(`🔵 Round start: +${bonuses.pearls} pearls from relics`);
    }

    if (bonuses.water > 0) {
      gameStore.state.currentWater += bonuses.water;
      console.log(`🔵 Round start: +${bonuses.water} water from relics`);
    }

    if (bonuses.rerolls > 0) {
      gameStore.state.rerollsRemaining += bonuses.rerolls;
      console.log(`🔵 Round start: +${bonuses.rerolls} rerolls from relics`);
    }

    this.resetRoundState();
  }

  static resetRoundState() {
    this.isFirstDrawOfRound = true;
  }

  // Helper method to calculate final card cost
  static getFinalCost(type, basePrice) {
    let reduction = 0;

    gameStore.state.relics.forEach((relic) => {
      switch (type) {
        case "shopCard":
          if (relic.effects?.shopCardDiscount) {
            reduction += relic.effects.shopCardDiscount;
            console.log(
              `💰 ${relic.name} reducing shop card cost by ${relic.effects.shopCardDiscount}`
            );
          }
          break;
        case "relic":
          if (relic.effects?.relicDiscount) {
            reduction += relic.effects.relicDiscount;
            console.log(
              `💰 ${relic.name} reducing relic cost by ${relic.effects.relicDiscount}`
            );
          }
          break;
        case "consumable":
          if (relic.effects?.consumableDiscount) {
            reduction += relic.effects.consumableDiscount;
            console.log(
              `💰 ${relic.name} reducing consumable cost by ${relic.effects.consumableDiscount}`
            );
          }
          break;
      }
    });

    // Ensure price doesn't go below 1
    return Math.max(1, basePrice - reduction);
  }
}
