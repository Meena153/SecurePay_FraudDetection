import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/* ─── masking helpers ─────────────────────────────────────── */
export const maskMobile = (mobile) => {
  if (!mobile) return "N/A";
  const s = String(mobile);
  if (s.length < 4) return s;
  return `${s.slice(0, 2)}****${s.slice(-2)}`;
};

export const maskAccount = (acc) => {
  if (!acc) return "N/A";
  const s = String(acc);
  return s.length > 4 ? `XXXXXX${s.slice(-4)}` : s;
};

/**
 * A security component that masks sensitive data by default.

 * Non-admins see ONLY the masked value with a permanent blur.
 * Admins see the masked/blurred value by default but can click the eye icon to reveal.
 */
const RevealableCell = ({ value, masked, isAdmin, className = "" }) => {
  const [revealed, setRevealed] = useState(false);

  // Analysts (Non-Admins) see ONLY the masked value with a permanent secure blur
  if (!isAdmin) {
    return (
      <span 
        className={`text-sm font-mono opacity-60 blur-[1.5px] select-none cursor-not-allowed transition-all hover:blur-none ${className}`} 
        title="Security Restricted: Analyst Visibility Only"
      >
        {masked}
      </span>
    );
  }

  // Admins see masked value by default (blurred) but can reveal full data
  return (
    <div className={`flex items-center gap-1.5 group/reveal ${className}`}>
      <span className={`text-sm font-mono transition-all duration-300 ${revealed ? 'opacity-100' : 'opacity-60 blur-[2px]'}`}>
        {revealed ? value || "N/A" : masked}
      </span>
      <button
        type="button"
        onClick={(e) => { 
          e.preventDefault();
          e.stopPropagation(); 
          setRevealed(p => !p); 
        }}
        title={revealed ? "Hide sensitive data" : "Reveal full identity"}
        className="opacity-60 group-hover/reveal:opacity-100 transition-all p-1 rounded-lg hover:bg-primary/20 bg-secondary/40 border border-white/5 active:scale-90"
      >
        {revealed
          ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
          : <Eye className="w-3.5 h-3.5 text-primary animate-pulse" />
        }
      </button>
    </div>
  );
};

export default RevealableCell;
