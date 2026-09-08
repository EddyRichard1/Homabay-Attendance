import { PrecisionButton } from "@/components/ui/PrecisionButton";
import * as Icons from "lucide-react";
import type { FlowState } from "@/types/flow";
import { ChevronLeft } from "lucide-react";
import { ScreenHeadline } from "@/components/ui/screen-headline";

interface ProductExplorerProps {
  flow: FlowState;
  onFinish: () => void;
}

export function ProductExplorer({ flow, onFinish }: ProductExplorerProps) {
  const isDetail = flow.currentScreen.id === "product_detail";
  const screen = flow.currentScreen;
  const firstName = flow.formData.name ? (flow.formData.name as string).split(" ")[0] : "";

  if (isDetail) {
    return (
      <div className="flex flex-1 flex-col px-6 pt-4 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D94F5]">
            SOLUTION PREVIEW
          </div>
          <button 
            onClick={() => flow.goToStep("product_list")}
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={10} /> BACK
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="aspect-[16/10] w-full rounded-2xl bg-[#132952] border border-white/5 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 opacity-20">
              <Icons.Layout size={40} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Solution Overview</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h2 className="text-[32px] font-bold tracking-[-0.03em] leading-[1.15] text-white">
              {flow.interpolate(screen.content.header)}
            </h2>
            <p className="text-[16px] leading-[1.6] text-white/50">
               {screen.content.overview}
            </p>
          </div>
        </div>

        <div className="mt-auto pb-10 flex flex-col gap-3">
          <PrecisionButton onClick={() => {
             // If they are on detail, we assume they are interested in THIS product
             const productId = flow.screens.find(s => s.id === "product_list")?.content.options?.find(o => o.label === flow.interpolate(screen.content.header))?.id;
             if (productId && !flow.selectedProductIds.includes(productId)) {
                flow.toggleProductSelect(productId);
             }
             onFinish();
          }}>
            {screen.content.primary_cta}
          </PrecisionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-4 pb-24">
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
          screenKey="screen-products"
          full={flow.interpolate(screen.content.question || screen.content.headline)}
          name={firstName}
          subtext="Select one or more. Your brief will be built around them."
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 pb-32">
        {screen.content.options?.map((opt) => {
          const IconComponent = (Icons as any)[opt.icon || ""] || Icons.HelpCircle;
          const isSelected = flow.selectedProductIds.includes(opt.id);
          
          return (
            <button
              key={opt.id}
              onClick={() => {
                flow.toggleProductSelect(opt.id);
              }}
              className={`flex flex-col rounded-2xl border p-4 transition-all duration-300 ${
                isSelected 
                  ? "border-[#3D94F5] bg-[#3D94F5]/10 shadow-[0_0_20px_rgba(61,148,245,0.1)]" 
                  : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isSelected ? "bg-[#3D94F5] text-white" : "bg-white/5 text-white/40"
              }`}>
                <IconComponent size={18} />
              </div>
              
              <div className="mt-4 flex flex-col gap-1.5">
                <span className="text-[13px] font-semibold leading-[1.2] text-white">
                  {opt.label}
                </span>
                <span className="text-[11px] font-normal leading-[1.45] text-white/38">
                  {opt.description}
                </span>
                {opt.proof && (
                  <div className="mt-2 text-[10px] font-medium uppercase leading-[1.4] tracking-[0.07em] text-[#3D94F5]">
                    {opt.proof}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-4 pt-4 bg-[#071426]/90 backdrop-blur-md border-t border-white/5">
        {flow.selectedProductIds.length > 0 ? (
          <PrecisionButton 
            className="w-full" 
            onClick={onFinish}
          >
            {flow.selectedProductIds.length > 1 
              ? "Prepare my selected briefs →"
              : (screen.content.options?.find(o => o.id === flow.selectedProductIds[0])?.cta_label || "Prepare my brief →")
            }
          </PrecisionButton>
        ) : (
          <button 
            className="w-full text-center text-[11px] font-bold uppercase tracking-widest text-[#3D94F5] hover:text-[#3D94F5]/80 transition-colors py-4" 
            onClick={onFinish}
          >
            {screen.content.skip_cta}
          </button>
        )}
      </div>
    </div>
  );
}



