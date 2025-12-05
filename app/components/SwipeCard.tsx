"use client";

import { motion, useAnimation } from "framer-motion";

export default function SwipeCard({ offer, onSwipe }: any) {
  const controls = useAnimation();

  const onEnd = (_: any, info: any) => {
    const x = info.offset.x;

    if (x > 120) {
      controls.start({ x: 300, opacity: 0 });
      onSwipe("right", offer);
    } else if (x < -120) {
      controls.start({ x: -300, opacity: 0 });
      onSwipe("left", offer);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      drag="x"
      onDragEnd={onEnd}
      animate={controls}
      className="w-full max-w-sm bg-black/70 text-white border border-[#16FF6E]/30 p-6 rounded-2xl"
    >
      <h2 className="text-xl font-bold text-[#16FF6E]">{offer.title}</h2>
      <p className="text-sm text-gray-300 mt-2">{offer.description}</p>
    </motion.div>
  );
}
