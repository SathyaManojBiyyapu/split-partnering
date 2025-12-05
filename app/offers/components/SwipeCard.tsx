"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SwipeCard({ items, onSwipe }: any) {
  const [index, setIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    onSwipe(direction, items[index]);
    setIndex((prev) => prev + 1);
  };

  if (index >= items.length) {
    return (
      <div className="text-center text-gray-300 mt-20">
        No more offers in this category 🙌
      </div>
    );
  }

  const item = items[index];

  return (
    <div className="flex justify-center mt-10">
      <AnimatePresence>
        <motion.div
          key={item.title}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x > 120) handleSwipe("right");
            if (info.offset.x < -120) handleSwipe("left");
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-80 h-96 bg-black/70 border border-[#16FF6E] rounded-2xl p-5 shadow-[0_0_30px_rgba(22,255,110,0.4)] cursor-grab"
        >
          <h2 className="text-2xl font-bold text-[#16FF6E] mb-3">
            {item.title}
          </h2>
          <p className="text-sm text-gray-300">{item.description}</p>

          <div className="mt-5 text-xs text-gray-400">
            Swipe → Right to request
            <br />
            Swipe ← Left to skip
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
