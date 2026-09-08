import { useState, useCallback, useEffect } from "react";
import SCREENS_DATA from "../../SCREENS.json";
import { CONFIG } from "./config";
import type { Screen, StepId, FormData, FlowState } from "@/types/flow";

export function useConversationalFlow(): FlowState {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const screens = SCREENS_DATA.screens as Screen[];
  const currentScreen = screens[currentStepIndex];

  const interpolate = <T extends string | string[] | undefined>(text: T): T => {
    if (!text) return text;
    
    const contextReplacer = (s: string) => {
      let res = s;
      if (res.includes("{name}")) {
        const firstName = formData.name ? formData.name.trim().split(/\s+/)[0] : "there";
        res = res.replace("{name}", firstName);
      }
      if (res.includes("{selected_product_name}")) {
        const gridScreen = screens.find(s => s.id === "product_list");
        if (selectedProductIds.length > 0) {
          const firstProduct = gridScreen?.content.options?.find(o => o.id === selectedProductIds[0]);
          const suffix = selectedProductIds.length > 1 ? ` and ${selectedProductIds.length - 1} more` : "";
          res = res.replace("{selected_product_name}", (firstProduct?.label || "this product") + suffix);
        } else {
          res = res.replace("{selected_product_name}", "our innovations");
        }
      }
      return res;
    };

    if (Array.isArray(text)) {
      return text.map(contextReplacer) as T;
    }
    return contextReplacer(text as string) as T;
  };

  const updateFormData = useCallback((newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const goToStep = useCallback((stepId: StepId) => {
    const index = screens.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(index);
        setIsTransitioning(false);
      }, CONFIG.ANIMATION_DURATION);
    }
  }, [currentStepIndex, screens]);

  const goToNext = useCallback(() => {
    if (currentStepIndex < screens.length - 1) {
      const nextStepId = screens[currentStepIndex + 1].id;
      goToStep(nextStepId as StepId);
    }
  }, [currentStepIndex, screens, goToStep]);

  useEffect(() => {
    if (currentScreen?.behavior?.auto_advance) {
      const timer = setTimeout(() => {
        goToNext();
      }, currentScreen.behavior.duration || CONFIG.AUTO_ADVANCE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentScreen, goToNext]);

  const toggleProductSelect = useCallback((productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);


  const goBack = useCallback(() => {
    if (currentStepIndex > 1) { 
      const prevStepId = screens[currentStepIndex - 1].id;
      goToStep(prevStepId as StepId);
    }
  }, [currentStepIndex, screens, goToStep]);

  return {
    currentScreen,
    currentStepIndex,
    formData,
    updateFormData,
    goToNext,
    goBack,
    goToStep,
    direction,
    isTransitioning,
    toggleProductSelect,
    selectedProductIds,
    interpolate,
    isFirstStep: currentStepIndex <= 1,
    isLastStep: currentStepIndex === screens.length - 1,
    screens,
  };
}

