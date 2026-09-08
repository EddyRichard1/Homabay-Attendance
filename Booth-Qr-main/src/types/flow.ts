export type StepId = 
  | "splash" 
  | "name" 
  | "organisation" 
  | "contact" 
  | "product_list" 
  | "product_detail" 
  | "success";

export interface ScreenOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  proof?: string;
  cta_label?: string;
  feedback?: {
    subtext: string;
    tag: string;
  };
}

export interface ScreenField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}

export interface ScreenContent {
  headline?: string;
  subtext?: string;
  question?: string;
  label?: string;
  placeholder?: string;
  cta?: string;
  options?: ScreenOption[];
  fields?: ScreenField[];
  header?: string;
  overview?: string;
  primary_cta?: string;
  skip_cta?: string;
  step_label?: string;
  context_stats?: { num: string; label: string }[];
  proof_points?: { title: string; text: string }[];
  next_steps?: string[];
  proof_card?: { title: string; text: string };
}

export interface ScreenBehavior {
  auto_advance?: boolean;
  duration?: number;
}

export interface Screen {
  id: StepId;
  type: string;
  content: ScreenContent;
  behavior?: ScreenBehavior;
}

export interface FormData {
  name?: string;
  organisation?: string;
  email?: string;
  phone?: string;
  [key: string]: string | string[] | undefined;
}

export interface FlowState {
  currentScreen: Screen;
  currentStepIndex: number;
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  goToNext: () => void;
  goBack: () => void;
  goToStep: (stepId: StepId) => void;
  direction: number;
  isTransitioning: boolean;
  toggleProductSelect: (productId: string) => void;
  selectedProductIds: string[];
  interpolate: <T extends string | string[] | undefined>(text: T) => T;
  isFirstStep: boolean;
  isLastStep: boolean;
  screens: Screen[];
}
