import { motion } from "framer-motion";
import Image from "next/image";

// Card background imports
import seafolk1Image from "../../public/assets/cards/seafolk-1.png";
import seafolk2Image from "../../public/assets/cards/seafolk-2.png";
import seafolk3Image from "../../public/assets/cards/seafolk-3.png";
import seafolk4Image from "../../public/assets/cards/seafolk-4.png";
// u seafolk backgrounds
import seafolk1uImage from "../../public/assets/cards/seafolk-1-u.png";
import seafolk2uImage from "../../public/assets/cards/seafolk-2-u.png";
import seafolk3uImage from "../../public/assets/cards/seafolk-3-u.png";
import seafolk4uImage from "../../public/assets/cards/seafolk-4-u.png";

import machine1Image from "../../public/assets/cards/machine-1.png";
import machine2Image from "../../public/assets/cards/machine-2.png";
import machine3Image from "../../public/assets/cards/machine-3.png";
import machine4Image from "../../public/assets/cards/machine-4.png";
// u machine backgrounds
import machine1uImage from "../../public/assets/cards/machine-1-u.png";
import machine2uImage from "../../public/assets/cards/machine-2-u.png";
import machine3uImage from "../../public/assets/cards/machine-3-u.png";
import machine4uImage from "../../public/assets/cards/machine-4-u.png";

import economy1Image from "../../public/assets/cards/economy1.png";
import economy2Image from "../../public/assets/cards/economy2.png";
import { BADGES } from "@/database";

const Card = ({ card, onClick, className = "", animate = true }) => {
  if (!card) return null;

  const getCardColor = () => {
    switch (card.type) {
      case "seafolk":
        return "bg-blue-600";
      case "machine":
        return "bg-purple-600";
      case "economy":
        return "bg-yellow-600";
      case "consumable":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getCardBackground = (card) => {
    // Map of card combinations to their respective background images
    const backgroundMap = {
      // Regular seafolk cards
      "seafolk-suit1": seafolk1Image,
      "seafolk-suit2": seafolk2Image,
      "seafolk-suit3": seafolk3Image,
      "seafolk-suit4": seafolk4Image,

      // u seafolk cards (with cost)
      "seafolk-suit1-u": seafolk1uImage,
      "seafolk-suit2-u": seafolk2uImage,
      "seafolk-suit3-u": seafolk3uImage,
      "seafolk-suit4-u": seafolk4uImage,

      // Regular machine cards
      "machine-suit1": machine1Image,
      "machine-suit2": machine2Image,
      "machine-suit3": machine3Image,
      "machine-suit4": machine4Image,

      // u machine cards (with cost)
      "machine-suit1-u": machine1uImage,
      "machine-suit2-u": machine2uImage,
      "machine-suit3-u": machine3uImage,
      "machine-suit4-u": machine4uImage,

      // Economy cards
      "economy-normal": economy1Image,
      "economy-shop": economy2Image,
    };

    // Determine the correct key for the map
    let key = "";

    if (card.type === "seafolk") {
      const suitNumber = getSuitNumber(card.suit);
      key = `seafolk-suit${suitNumber}${card.cost ? "-u" : ""}`;
    } else if (card.type === "machine") {
      const suitNumber = getSuitNumber(card.suit);
      key = `machine-suit${suitNumber}${card.cost ? "-u" : ""}`;
    } else if (card.type === "economy") {
      key = card.cost ? "economy-shop" : "economy-normal";
    }

    return backgroundMap[key];
  };

  // Helper function to convert suit to number
  const getSuitNumber = (suit) => {
    const suitMap = {
      CORAL: 1,
      SHELL: 2,
      WAVE: 3,
      STAR: 4,
    };
    return suitMap[suit] || 1; // Default to 1 if suit not found
  };

  const CardContent = () => (
    <div className={`relative w-full h-full p-2 rounded-lg ${className}`}>
      {/* Background Image */}
      <Image
        src={getCardBackground(card)}
        alt={`${card.type} card background`}
        fill
        priority
        className="object-cover rounded-lg"
      />

      {/* Card Content */}
      <div className="relative z-10">
        {/* Card Values - Separate wrappers for each type */}
        {card.type === "seafolk" && (
          <div className="absolute top-4 left-2">
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              {card.value}
            </div>
          </div>
        )}

        {card.type === "machine" && (
          <div className="absolute top-5 left-3">
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              {card.multiplier}
            </div>
          </div>
        )}

        {card.type === "economy" && (
          <div className="absolute top-4 left-2">
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              +{card.pearlValue}
            </div>
          </div>
        )}

        {/* Badges */}
        {card.upgrades && card.upgrades.length > 0 && (
          <div className="absolute top-1 right-1 flex gap-1 flex flex-wrap">
            {card.upgrades.map((badge, index) => (
              <div key={index} className="w-[50px] h-[50px]">
                <Image
                  src={BADGES[badge.type].image}
                  alt={BADGES[badge.type].name}
                  width={24}
                  height={24}
                  className="w-[50px] h-[50px]"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        className="w-48 h-72 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
      >
        <CardContent />
      </motion.div>
    );
  }

  return (
    <div className="w-36 h-48 cursor-pointer" onClick={onClick}>
      <CardContent />
    </div>
  );
};

export default Card;
