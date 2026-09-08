import React from "react";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface ContextGuideProps {
  title: string;
  text: string;
  items?: { title: string; text: string }[];
}

export const ContextGuide: React.FC<ContextGuideProps> = ({ title, text, items }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-3 rounded-2xl border border-[#3D94F5]/20 bg-[#3D94F5]/5 p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3D94F5]/20 text-[#3D94F5]">
          <Info size={16} />
        </div>
        <div className="flex flex-col">
          <div className="text-[13px] font-bold leading-tight text-white">
            {title}
          </div>
          <div className="mt-0.5 text-[11px] font-normal leading-normal text-white/40">
            {text}
          </div>
        </div>
      </div>

      {items && items.length > 0 && (
        <div className="grid gap-3 pt-2 border-t border-white/5">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#3D94F5]">
                {item.title}
              </div>
              <div className="text-[11px] font-medium text-white/30">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
