import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
 * Adapted for DirectDayzapp (honey variety gallery).
 *
 * License & Usage (Skiper UI free):
 * - Free to use and modify in personal and commercial projects.
 * - Attribution to Skiper UI is required for the free version.
 *
 * Author: @gurvinder-singh02 / Skiper UI — https://skiper-ui.com
 */

export type HoverExpandImage = {
  src: string;
  alt: string;
  code: string;
};

export function HoverExpand({
  images,
  className,
}: {
  images: HoverExpandImage[];
  className?: string;
}) {
  const [activeImage, setActiveImage] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className={cn('relative w-full max-w-6xl', className)}
    >
      <div className="flex w-full items-center justify-center gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.div
            key={`${image.code}-${index}`}
            className="relative shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
            initial={{ width: '2.5rem', height: '16rem' }}
            animate={{
              width: activeImage === index ? '16rem' : '4.25rem',
              height: '16rem',
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={() => setActiveImage(index)}
            onHoverStart={() => setActiveImage(index)}
            onFocus={() => setActiveImage(index)}
            tabIndex={0}
            role="button"
            aria-pressed={activeImage === index}
            aria-label={image.alt}
          >
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[1] bg-gradient-to-t from-black/45 to-transparent"
                />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeImage === index && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[2] flex flex-col items-start justify-end p-4"
                >
                  <span className="rounded-md bg-white/90 px-2 py-1 text-sm font-semibold text-[var(--text)]">
                    {image.code}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={image.src}
              className="size-full object-cover"
              alt=""
              draggable={false}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
