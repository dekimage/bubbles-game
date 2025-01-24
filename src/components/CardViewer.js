import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Card from "./Card";

const SORT_OPTIONS = {
  TYPE: "type",
  SUIT: "suit",
  VALUE: "value",
};

const CardViewer = ({ isOpen, onClose, cards, title }) => {
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.TYPE);

  const getSortedCards = () => {
    return [...cards].sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.TYPE:
          // Primary sort by type
          if (a.type !== b.type) return a.type.localeCompare(b.type);
          // Secondary sort by suit
          if (a.suit !== b.suit)
            return (a.suit || "").localeCompare(b.suit || "");
          // Tertiary sort by value/multiplier
          return (
            (a.value || a.multiplier || 0) - (b.value || b.multiplier || 0)
          );

        case SORT_OPTIONS.SUIT:
          // Primary sort by suit
          if (a.suit !== b.suit)
            return (a.suit || "Z").localeCompare(b.suit || "Z");
          // Secondary sort by value/multiplier
          return (
            (a.value || a.multiplier || 0) - (b.value || b.multiplier || 0)
          );

        case SORT_OPTIONS.VALUE:
          // Sort by value/multiplier
          return (
            (a.value || a.multiplier || 0) - (b.value || b.multiplier || 0)
          );

        default:
          return 0;
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col bg-slate-800 border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">{title}</DialogTitle>
            <div className="flex gap-2">
              {Object.entries(SORT_OPTIONS).map(([label, value]) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`px-3 py-1 rounded text-sm transition-colors
                            ${
                              sortBy === value
                                ? "bg-purple-600 text-white"
                                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                            }`}
                >
                  Sort by {label.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {sortBy === SORT_OPTIONS.TYPE && (
            <div className="space-y-6">
              {["seafolk", "machine", "economy", "consumable"].map((type) => {
                const typeCards = getSortedCards().filter(
                  (card) => card.type === type
                );
                if (typeCards.length === 0) return null;

                return (
                  <div key={type} className="space-y-2">
                    <h3 className="text-lg font-bold text-white capitalize px-4">
                      {type}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {typeCards.map((card) => (
                        <div key={card.id} className="flex justify-center">
                          <Card card={card} animate={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sortBy !== SORT_OPTIONS.TYPE && (
            <div className="grid grid-cols-3 gap-4 p-4">
              {getSortedCards().map((card) => (
                <div key={card.id} className="flex justify-center">
                  <Card card={card} animate={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardViewer;
