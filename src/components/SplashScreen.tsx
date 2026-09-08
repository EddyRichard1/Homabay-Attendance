import { motion, useReducedMotion } from "framer-motion";
import { TextEffect } from "@/components/ui/text-effect";

export function SplashScreen({ headline, subtext }: { headline: string; subtext: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--color-cs-navy-deep)] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Placeholder for Logo */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full fill-[var(--color-cs-blue)]"
          >
            <path d="M20 20h60v60H20z" />
          </svg>
        </div>

        <h1 className="text-[28px] font-bold leading-[1.12] tracking-[-0.3px] text-white">
          {shouldReduceMotion ? (
            headline
          ) : (
            <TextEffect per="word" as="span" preset="blur">
              {headline}
            </TextEffect>
          )}
        </h1>
        <div className="mt-2 text-[14px] font-normal leading-[1.55] text-white/45 uppercase tracking-[0.12em]">
          {shouldReduceMotion ? (
            subtext
          ) : (
            <TextEffect per="char" as="span" preset="fade" delay={0.5}>
              {subtext}
            </TextEffect>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 h-[2px] w-12 overflow-hidden rounded-full bg-white/10"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full w-full bg-[var(--color-cs-blue)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
