import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PrecisionButton } from "@/components/ui/PrecisionButton";
import { ScreenHeadline } from "@/components/ui/screen-headline";
import type { FlowState } from "@/types/flow";

interface SuccessScreenProps {
  flow: FlowState;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ flow }) => {
  const screen = flow.currentScreen;
  const firstName = flow.formData.name ? (flow.formData.name as string).split(" ")[0] : "";
  const productListScreen = flow.screens.find(s => s.id === "product_list");
  
  const selectedOptions = productListScreen?.content.options?.filter(o => 
    flow.selectedProductIds.includes(o.id)
  ) || [];

  const isSkipped = selectedOptions.length === 0;
  const isMulti = selectedOptions.length > 1;

  // Resolve dynamic subtext
  let displaySubtext = screen.content.subtext || "";
  if (isSkipped) {
    displaySubtext = (screen.content as any).skip_subtext || displaySubtext;
  } else if (isMulti) {
    displaySubtext = (screen.content as any).multi_subtext || displaySubtext;
  } else {
    displaySubtext = selectedOptions[0].feedback?.subtext || displaySubtext;
  }

  // Resolve tags
  const tags = isSkipped 
    ? [(screen.content as any).tag_fallback || "Craft Silicon"]
    : selectedOptions.map(o => o.feedback?.tag || o.label);

  return (
    <div className="flex flex-1 flex-col items-center px-8 pt-4 text-center pb-24">
      <motion.div 
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0A6AE2] shadow-[0_0_30px_rgba(10,106,226,0.4)] mb-4"
      >
        <Check size={28} className="text-white" strokeWidth={3} />
      </motion.div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tags.map((tag, i) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3D94F5]"
          >
            {tag}
          </motion.div>
        ))}
      </div>

      <ScreenHeadline
        screenKey="screen-success"
        full={flow.interpolate(screen.content.headline)}
        name={firstName}
        subtext={flow.interpolate(displaySubtext)}
      />

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-6 w-full rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 text-left"
      >
        <div className="text-[10px] font-medium uppercase tracking-[0.10em] text-[#3D94F5] mb-3">
          Next Steps
        </div>
        <div className="flex flex-col gap-3">
          {screen.content.next_steps?.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3D94F5]/10 text-[10px] font-bold text-[#3D94F5] border border-[#3D94F5]/20 mt-0.5">
                {i + 1}
              </div>
              <div className="text-[12px] font-normal leading-[1.5] text-white/50">
                {step}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-4 pt-4 bg-[#071426]/90 backdrop-blur-md border-t border-white/5">
        <PrecisionButton 
          className="w-full" 
          onClick={() => {
            window.open("https://products.cspl-uat.com/products.html", "_blank");
          }}
        >
          {screen.content.cta}
        </PrecisionButton>
      </div>
    </div>
  );
};
