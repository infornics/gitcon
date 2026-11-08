interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  id,
}: ToggleSwitchProps) {
  const isSm = size === "sm";

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
        isSm ? "h-5 w-9" : "h-6 w-11"
      } ${
        checked
          ? "bg-primary shadow-[0_0_12px_rgba(88,170,176,0.35)]"
          : "bg-surface-offset hover:bg-white/20 border border-white/5"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          isSm
            ? `h-3.5 w-3.5 mt-[3px] ${checked ? "translate-x-4.5" : "translate-x-1"}`
            : `h-4.5 w-4.5 mt-[3px] ${checked ? "translate-x-5.5" : "translate-x-1"}`
        }`}
      />
    </button>
  );
}

