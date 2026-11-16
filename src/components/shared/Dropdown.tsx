import type { ReactNode } from "react";

export default function Dropdown({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`absolute z-[61] flex animate-fade-up flex-col rounded-2xl bg-surface shadow-float ${className}`}>
      {children}
    </div>
  );
}
