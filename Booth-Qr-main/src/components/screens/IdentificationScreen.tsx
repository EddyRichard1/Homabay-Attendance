import React from "react";
import { ChevronLeft } from "lucide-react";
import { PrecisionInput } from "@/components/ui/PrecisionInput";
import { PrecisionButton } from "@/components/ui/PrecisionButton";
import { ScreenHeadline } from "@/components/ui/screen-headline";
import type { FlowState } from "@/types/flow";

interface IdentificationScreenProps {
  flow: FlowState;
}

export const IdentificationScreen: React.FC<IdentificationScreenProps> = ({ flow }) => {
  const screen = flow.currentScreen;
  const id = screen.id;
  const firstName = flow.formData.name ? (flow.formData.name as string).split(" ")[0] : "";

  return (
    <div className="flex flex-1 flex-col px-6 pt-4">
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D94F5]">
            {screen.content.step_label}
          </div>
          {!flow.isFirstStep && (
            <button 
              onClick={() => flow.goBack()}
              className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={10} /> BACK
            </button>
          )}
        </div>
        
        {id === "name" ? (
          <ScreenHeadline
            screenKey="screen-name"
            full={flow.interpolate(screen.content.question || screen.content.headline)}
            subtext={screen.content.subtext || ""}
          />
        ) : (
          <ScreenHeadline
            screenKey="screen-org"
            full={flow.interpolate(screen.content.question || screen.content.headline)}
            name={firstName}
            subtext={screen.content.subtext || ""}
          />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D94F5]">
            {screen.content.label}
          </div>
          <PrecisionInput
            placeholder={screen.content.placeholder}
            value={(flow.formData[id] as string) || ""}
            onChange={(e) => flow.updateFormData({ [id]: e.target.value })}
            autoFocus={id === "name"}
            className="text-[18px] font-normal text-white placeholder:text-white/20"
            onKeyDown={(e) => {
              if (e.key === "Enter" && flow.formData[id]) {
                flow.goToNext();
              }
            }}
          />
        </div>

        {/* Proof Points for Organisation Step */}
        {id === "organisation" && screen.content.proof_points && (
          <div className="flex flex-col gap-3">
            {screen.content.proof_points.map((pt) => (
              <div key={pt.title} className="flex flex-col gap-1 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                <div className="text-[13px] font-bold leading-[1.2] text-white">
                  {pt.title}
                </div>
                <div className="text-[11px] font-normal leading-[1.45] text-white/38">
                  {pt.text}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="mt-auto pt-4 pb-10">
        <PrecisionButton 
          disabled={!flow.formData[id]}
          onClick={() => flow.goToNext()}
          className="w-full"
        >
          {screen.content.cta}
        </PrecisionButton>
      </div>
    </div>
  );
};
