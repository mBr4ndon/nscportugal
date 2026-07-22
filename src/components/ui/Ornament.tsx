import { cn } from "@/lib/utils";

interface OrnamentProps {
  className?: string;
  variant?: "cross" | "fleur" | "dot";
}

export function Ornament({ className, variant = "cross" }: OrnamentProps) {
  return (
    <div
      className={cn(
        "ornament text-petrol/40",
        className
      )}
      aria-hidden="true"
    >
      {variant === "cross" && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gold flex-shrink-0"
        >
          <path
            d="M12 2 L12 22 M6 8 L18 8"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      )}
      {variant === "fleur" && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gold flex-shrink-0"
        >
          <path
            d="M12 2 C14 6 14 8 12 10 C10 8 10 6 12 2 Z M12 22 C14 18 14 16 12 14 C10 16 10 18 12 22 Z M2 12 C6 10 8 10 10 12 C8 14 6 14 2 12 Z M22 12 C18 10 16 10 14 12 C16 14 18 14 22 12 Z"
            fill="currentColor"
            opacity="0.8"
          />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      )}
      {variant === "dot" && (
        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
      )}
    </div>
  );
}
