import { cn } from "../../lib/utils";

interface PrecisionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function PrecisionInput({ label, className, ...props }: PrecisionInputProps) {
  return (
    <div className="precision-input-wrap">
      <label className="precision-label">
        {label}
      </label>
      <input
        className={cn("precision-input", className)}
        {...props}
      />
    </div>
  );
}
