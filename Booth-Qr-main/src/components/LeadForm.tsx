import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConversationalFlow } from "@/lib/useConversationalFlow";
import { SplashScreen } from "./SplashScreen";
import { ProductExplorer } from "@/components/ProductExplorer";
import { IdentificationScreen } from "./screens/IdentificationScreen";
import { ContactScreen } from "./screens/ContactScreen";
import { SuccessScreen } from "./screens/SuccessScreen";
import { ContextBand } from "./ContextBand";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LeadForm() {
  const flow = useConversationalFlow();
  const submitLead = useMutation(api.leads.submit);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    try {
      const currentData = flow.formData;
      const gridScreen = flow.screens.find((s) => s.id === "product_list");
      const interests = flow.selectedProductIds.length > 0
        ? flow.selectedProductIds
            .map(id => gridScreen?.content.options?.find((o) => o.id === id)?.label || id)
            .join(", ")
        : "Not Sure";

      await submitLead({
        name: currentData.name || "",
        email: currentData.email || "",
        phone: currentData.phone || "",
        organisation: currentData.organisation || "",
        role: (currentData.role as string) || "",
        productInterest: interests,
      });
      flow.goToStep("success");
    } catch (err) {
      console.error("Submission failed", err);
      if (err instanceof Error && err.message.includes("ALREADY_REGISTERED")) {
        setError("You are already registered with this email or phone number.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const renderStep = () => {
    const screen = flow.currentScreen;
    if (!screen) return null;
    
    switch (screen.id) {
      case "splash":
        return <SplashScreen headline={screen.content.headline || ""} subtext={screen.content.subtext || ""} />;
      case "name":
        return <IdentificationScreen flow={flow} />;
      case "organisation":
      case "contact":
        return <ContactScreen flow={flow} />;
      case "product_list":
      case "product_detail":
        return <ProductExplorer flow={flow} onFinish={handleFinish} />;
      case "success":
        return <SuccessScreen flow={flow} />;
      default:
        return null;
    }
  };

  const showProgress = !["splash", "success"].includes(flow.currentScreen?.id || "");

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-[#071426] font-inter overflow-x-hidden">
      {/* Progress Dots - Sticky at top */}
      {showProgress && (
        <div className="flex gap-1.5 justify-center py-4 px-6 shrink-0 z-10 bg-[#071426]">
          {flow.screens
            .filter(s => !["splash", "success"].includes(s.id))
            .map((s) => {
              const activeIndex = flow.screens.findIndex(scr => scr.id === flow.currentScreen.id);
              const screenIndex = flow.screens.findIndex(scr => scr.id === s.id);
              const isDone = activeIndex > screenIndex;
              const isDotActive = activeIndex === screenIndex;
              
              return (
                <div 
                  key={s.id}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    isDotActive || isDone ? "flex-1 max-w-[40px] bg-[var(--color-cs-blue)]" : "flex-1 max-w-[20px] bg-white/15"
                  }`}
                />
              );
            })}
        </div>
      )}

      {/* Context Band */}
      {flow.currentScreen.id === "name" && flow.currentScreen.content.context_stats && (
        <ContextBand stats={flow.currentScreen.content.context_stats} />
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={flow.currentScreen.id}
          initial={{ opacity: 0, x: flow.direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: flow.direction * -30 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Error Toast/Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-[#EE4444] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-white/20"
          >
            <div className="text-[14px] font-medium">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-white/60 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



