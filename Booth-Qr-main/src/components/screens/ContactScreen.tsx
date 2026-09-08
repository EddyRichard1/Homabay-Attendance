import React from "react";
import { ChevronLeft } from "lucide-react";
import { PrecisionInput } from "@/components/ui/PrecisionInput";
import { PrecisionButton } from "@/components/ui/PrecisionButton";
import { ScreenHeadline } from "@/components/ui/screen-headline";
import { ContextGuide } from "@/components/ui/ContextGuide";
import type { FlowState } from "@/types/flow";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ContactScreenProps {
  flow: FlowState;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ flow }) => {
  const screen = flow.currentScreen;
  const firstName = flow.formData.name ? (flow.formData.name as string).split(" ")[0] : "";

  const email = (flow.formData.email as string) || "";
  const phone = (flow.formData.phone as string) || "";

  const duplicateInfo = useQuery(api.leads.checkDuplicate, { 
    email: email.includes("@") ? email : undefined,
    phone: phone.length >= 8 ? phone : undefined
  });

  const isDuplicate = duplicateInfo?.email || duplicateInfo?.phone || false;

  // Check if all required fields in this step are filled
  const isFilled = (screen.content.fields?.every(f => !!flow.formData[f.id]) || false) && !isDuplicate;

  return (
    <div className="flex flex-1 flex-col px-6 pt-4">
      <div className="flex flex-col gap-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D94F5]">
            {screen.content.step_label}
          </div>
          <button 
            onClick={() => flow.goBack()}
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={10} /> BACK
          </button>
        </div>
        <ScreenHeadline
          screenKey={`screen-${screen.id}`}
          full={flow.interpolate(screen.content.question || screen.content.headline)}
          name={firstName}
          subtext={screen.content.subtext || ""}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {/* Guide moved above inputs */}
        {screen.content.proof_card && (
          <ContextGuide 
            title={screen.content.proof_card.title}
            text={screen.content.proof_card.text}
          />
        )}

        <div className="flex flex-col gap-8">
          {screen.content.fields?.map((f) => (
            <div key={f.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D94F5]">
                  {f.label}
                </div>
                {((f.id === "email" && duplicateInfo?.email) || (f.id === "phone" && duplicateInfo?.phone)) && (
                  <div className="text-[11px] font-semibold text-[#EE4444] animate-pulse">
                    ALREADY REGISTERED
                  </div>
                )}
              </div>
              <PrecisionInput
                type={f.type}
                placeholder={f.placeholder}
                value={(flow.formData[f.id] as string) || ""}
                onChange={(e) => {
                  flow.updateFormData({ [f.id]: e.target.value });
                }}
                className={`text-[19px] font-normal transition-colors ${(f.id === "email" && duplicateInfo?.email) || (f.id === "phone" && duplicateInfo?.phone) ? "text-[#EE4444] border-[#EE4444]/50" : "text-white placeholder:text-white/20"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isFilled && !isDuplicate) {
                    flow.goToNext();
                  }
                }}
              />
              {f.id === "email" && duplicateInfo?.email && (
                <div className="text-[12px] text-[#EE4444]/80 mt-1">This email has been used.</div>
              )}
              {f.id === "phone" && duplicateInfo?.phone && (
                <div className="text-[12px] text-[#EE4444]/80 mt-1">This phone number has been used.</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 pb-10">
        <PrecisionButton 
          disabled={!isFilled}
          onClick={() => flow.goToNext()}
          className="w-full"
        >
          {screen.content.cta}
        </PrecisionButton>
      </div>
    </div>
  );
};
