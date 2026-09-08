import { motion, useReducedMotion, BezierDefinition } from 'framer-motion';
import { TextEffect } from '@/components/ui/text-effect';

interface ScreenHeadlineProps {
  /** The part of the headline BEFORE the name. e.g. "Nice to meet you, " */
  before?: string | string[];
  /** The personalised name to highlight in brand blue. e.g. "Garvin" */
  name?: string;
  /** The part of the headline AFTER the name. e.g. ". Where do you work?" */
  after?: string | string[];
  /** For screens with no name injection, pass the full headline here */
  full?: string | string[];
  /** The subtext paragraph below the headline */
  subtext: string;
  /** Unique key — must change on every screen transition to retrigger animation */
  screenKey: string;
}

export function ScreenHeadline({
  before,
  name,
  after,
  full,
  subtext,
  screenKey,
}: ScreenHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderMultiLine = (content: string | string[], variants: any, delay: number = 0) => {
    if (!content) return null;
    const lines = Array.isArray(content) ? content : [content];
    
    return lines.map((line, i) => {
      // Check if this line contains the name to color it
      const hasName = name && line.includes(name);
      
      if (hasName && name) {
        // Split the line by the name to isolate it for coloring
        const parts = line.split(name);
        return (
          <div key={i} className="block">
            {parts[0] && (
              <TextEffect
                per="word"
                as="span"
                variants={variants}
                className="inline"
                delay={delay + (i * 0.2)}
              >
                {parts[0]}
              </TextEffect>
            )}
            <TextEffect
              per="char"
              as="span"
              variants={nameVariants}
              className="inline text-[#3D94F5]"
              delay={delay + (i * 0.2) + (parts[0] ? parts[0].split(' ').length * 0.05 : 0)}
            >
              {name}
            </TextEffect>
            {parts[1] && (
              <TextEffect
                per="word"
                as="span"
                variants={variants}
                className="inline"
                delay={delay + (i * 0.2) + (parts[0]?.split(' ').length || 0) * 0.05 + (name.length * 0.04)}
              >
                {parts[1]}
              </TextEffect>
            )}
          </div>
        );
      }

      return (
        <div key={i} className="block">
          <TextEffect
            per="word"
            as="span"
            variants={variants}
            className="inline"
            delay={delay + (i * 0.2)} // Stagger lines slightly
          >
            {line}
          </TextEffect>
        </div>
      );
    });
  };

  // Custom blur+slide variant — words enter from slightly below with blur clearing
  const headlineVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        y: 14,
        filter: 'blur(8px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.28,
          ease: [0.25, 0.1, 0.25, 1] as BezierDefinition,
        },
      },
    },
  };

  // Name chars animate in one by one, slightly after the surrounding words
  const nameVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.04,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      hidden: {
        opacity: 0,
        y: 10,
        filter: 'blur(6px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.22,
          ease: [0.25, 0.1, 0.25, 1] as BezierDefinition,
        },
      },
    },
  };

  if (shouldReduceMotion) {
    return (
      <div key={screenKey}>
        <h2 className="mb-0.5 text-[28px] xs:text-[32px] font-bold leading-[1.12] tracking-[-0.3px] text-white">
          {full || (
            <>
              {before}
              <span className="text-[#3D94F5]">{name}</span>
              {after}
            </>
          )}
        </h2>
        <p className="mt-1 text-[15px] xs:text-[16px] font-normal leading-[1.5] text-white/45">
          {subtext}
        </p>
      </div>
    );
  }

  return (
    <div key={screenKey}>
      {/* Headline */}
      <h2 className="mb-0.5 text-[28px] xs:text-[32px] font-bold leading-[1.15] tracking-[-0.3px] text-white">
        {full ? (
          renderMultiLine(full, headlineVariants)
        ) : (
          <div className="flex flex-col items-start gap-0">
            {renderMultiLine(before || "", headlineVariants)}
            {name && (
              <div className="block">
                <TextEffect
                  per="char"
                  as="span"
                  variants={nameVariants}
                  className="inline text-[#3D94F5]"
                  delay={0.1}
                >
                  {name}
                </TextEffect>
              </div>
            )}
            {renderMultiLine(after || "", headlineVariants, name ? (name.length * 0.04) + 0.1 : 0)}
          </div>
        )}
      </h2>

      {/* Subtext — fades in after headline */}
      <motion.p
        className="mt-1 text-[15px] xs:text-[16px] font-normal leading-[1.5] text-white/45"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.65, ease: [0.25, 0.1, 0.25, 1] as BezierDefinition }}
      >
        {subtext}
      </motion.p>
    </div>
  );
}
