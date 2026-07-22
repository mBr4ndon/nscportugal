import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  color?: "cream" | "petrol";
}

export function Logo({ className, variant = "full", color = "cream" }: LogoProps) {
  const stroke = color === "cream" ? "#FAF7F2" : "#2C3E50";
  const goldColor = "#B08D57";

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 100 120"
        fill="none"
        className={cn("w-10 h-12", className)}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Nossa Senhora da Cristandade"
      >
        {/* Coroa */}
        <g stroke={goldColor} strokeWidth="1.2" fill="none">
          <path d="M35 18 L40 10 L45 18 L50 8 L55 18 L60 10 L65 18" strokeLinejoin="round" />
          <line x1="50" y1="2" x2="50" y2="8" />
          <line x1="47" y1="5" x2="53" y2="5" />
          <rect x="35" y="18" width="30" height="5" />
        </g>
        {/* Véu / figura */}
        <path
          d="M50 25 C 35 25, 25 40, 25 65 C 25 90, 35 110, 50 115 C 65 110, 75 90, 75 65 C 75 40, 65 25, 50 25 Z"
          stroke={stroke}
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Rosto */}
        <path
          d="M40 45 C 40 55, 45 62, 50 62 C 55 62, 60 55, 60 45"
          stroke={stroke}
          strokeWidth="1"
          fill="none"
        />
        {/* Colar */}
        <circle cx="50" cy="75" r="2.5" stroke={stroke} strokeWidth="1" fill="none" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      className={cn("w-48 h-28", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Peregrinação de Nossa Senhora da Cristandade"
    >
      {/* Símbolo à esquerda */}
      <g transform="translate(5, 0)">
        {/* Coroa */}
        <g stroke={goldColor} strokeWidth="1" fill="none">
          <path d="M30 18 L34 12 L38 18 L42 10 L46 18 L50 12 L54 18" strokeLinejoin="round" />
          <line x1="42" y1="6" x2="42" y2="10" />
          <line x1="40" y1="8" x2="44" y2="8" />
          <rect x="30" y="18" width="24" height="4" />
        </g>
        {/* Figura */}
        <path
          d="M42 24 C 30 24, 22 38, 22 62 C 22 86, 30 105, 42 110 C 54 105, 62 86, 62 62 C 62 38, 54 24, 42 24 Z"
          stroke={stroke}
          strokeWidth="1.2"
          fill="none"
        />
        <path
          d="M34 42 C 34 52, 38 58, 42 58 C 46 58, 50 52, 50 42"
          stroke={stroke}
          strokeWidth="0.8"
          fill="none"
        />
      </g>
      {/* Texto */}
      <g fill={stroke} fontFamily="Cinzel, serif">
        <text x="80" y="45" fontSize="10" letterSpacing="2" fontWeight="500">
          PEREGRINAÇÃO
        </text>
        <line x1="80" y1="55" x2="180" y2="55" stroke={goldColor} strokeWidth="0.5" />
        <text x="80" y="70" fontSize="7" letterSpacing="1.5" fontWeight="400">
          NOSSA SENHORA
        </text>
        <text x="80" y="82" fontSize="7" letterSpacing="1.5" fontWeight="400">
          DA CRISTANDADE
        </text>
      </g>
    </svg>
  );
}
