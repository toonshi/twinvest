// animation.js

export const SlideUpVariants = {
  hidden: { y: 50, opacity: 0 }, // Start slightly below with no opacity
  visible: {
    y: 0, // Final position
    opacity: 1, // Fully visible
    transition: {
      staggerChildren: 2, // ✅ fixed typo
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

export const ZoomInVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      staggerChildren: 2, // ✅ fixed typo
      duration: 1.2,
      ease: "easeOut",
    },
  },
};
