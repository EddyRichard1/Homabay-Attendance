import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface PrecisionButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost" | "link";
  isFullWidth?: boolean;
}

export function PrecisionButton({
  children,
  className,
  variant = "primary",
  isFullWidth = true,
  ...props
}: PrecisionButtonProps) {
  const baseStyles = "relative flex items-center justify-center rounded-lg px-6 py-4 text-[15px] font-semibold tracking-[0.01em] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
  
  const variants = {
    primary: "bg-[var(--color-cs-blue)] text-white hover:bg-[var(--color-cs-blue-hover)]",
    ghost: "bg-transparent border border-[var(--color-cs-navy-border)] text-[var(--color-text-dark-secondary)] hover:bg-[var(--color-cs-navy-mid)] hover:text-white",
    link: "bg-transparent text-[var(--color-text-dark-tertiary)] hover:text-white underline underline-offset-4"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], isFullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

