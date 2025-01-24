import { motion } from "framer-motion";

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

  const CardContent = () => (
    <div
      className={`relative w-full h-full p-2 rounded-lg ${getCardColor()} ${className}`}
    >
      {/* Cost Badge (if card has cost) */}
      {card.cost && (
        <div
          className="absolute -top-2 -right-2 bg-yellow-500 px-2 py-1 rounded-full 
                    flex items-center gap-1 text-black font-bold shadow-lg transform scale-110"
        >
          <span className="text-lg">💎</span>
          <span className="text-sm">{card.cost}</span>
        </div>
      )}

      {/* Card Header */}
      <div className="text-xs font-bold mb-1 text-center bg-black/20 rounded py-1">
        {card.type.toUpperCase()}
      </div>

      {/* Card Main Content */}
      <div className="flex flex-col items-center justify-center h-[70%]">
        {card.type === "seafolk" && (
          <>
            <div className="text-4xl mb-2">{card.suitEmoji}</div>
            <div className="text-2xl font-bold">{card.value}</div>
          </>
        )}

        {card.type === "machine" && (
          <>
            <div className="text-4xl mb-2">{card.suitEmoji}</div>
            <div className="text-xl font-bold">×{card.multiplier}</div>
          </>
        )}

        {card.type === "economy" && (
          <>
            <div className="text-4xl mb-2">💎</div>
            <div className="text-xl font-bold">+{card.pearlValue}</div>
          </>
        )}
      </div>

      {/* Card Footer */}
      {card.suit && (
        <div className="absolute bottom-2 left-2 right-2 text-center text-xs bg-black/20 rounded py-1">
          {card.suit}
        </div>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        className="w-32 h-48 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
      >
        <CardContent />
      </motion.div>
    );
  }

  return (
    <div className="w-24 h-32 cursor-pointer" onClick={onClick}>
      <CardContent />
    </div>
  );
};

export default Card;
