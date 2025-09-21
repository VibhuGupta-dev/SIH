import React from "react";

const FloatingButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyles =
    "relative overflow-hidden rounded-2xl px-7 py-3 font-semibold text-base transition-all duration-300 transform hover:scale-[1.07] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 group";

  const variants = {
    primary:
      "bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-2xl",
    secondary:
      "bg-white/90 text-teal-700 border border-teal-200 hover:bg-white shadow-md hover:shadow-lg",
    ghost: "text-teal-600 hover:bg-teal-50 focus:ring-teal-400",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-label={typeof children === "string" ? children : "button"}
    >
      {/* Text layer */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Glow shimmer */}
      <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 animate-[shimmer_2s_infinite]"></span>

      {/* Subtle overlay */}
      <span className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition"></span>
    </button>
  );
};

export default FloatingButton;

/* Add shimmer animation globally (tailwind style injection) */
<style>
{`
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`}
</style>
