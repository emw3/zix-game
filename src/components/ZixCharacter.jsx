import { useState, useEffect, useId } from "react";

export const ZixCharacter = ({ mood = "idle", size = 100, speaking = false, className = "" }) => {
  const [frame, setFrame] = useState(0);
  const uid = useId();

  useEffect(() => {
    const iv = setInterval(() => setFrame((f) => f + 1), 400);
    return () => clearInterval(iv);
  }, []);

  const bounce = frame % 2 === 0;
  const eyeShift = mood === "dizzy" ? Math.sin(frame) * 3 : 0;
  const bodyTilt =
    mood === "wave" ? Math.sin(frame * 0.8) * 5 : mood === "dizzy" ? Math.sin(frame * 1.2) * 8 : 0;

  const bodyGradId = `bodyGrad-${uid}`;
  const bodyInnerId = `bodyInner-${uid}`;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size * 1.2 }}>
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.8,
          height: size * 0.3,
          bottom: 0,
          left: "10%",
          background: "radial-gradient(ellipse, rgba(120,255,180,0.3), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 120 132"
        style={{
          transform: `rotate(${bodyTilt}deg) translateY(${bounce && mood !== "dizzy" ? -3 : 0}px)`,
          transition: "transform 0.3s ease",
          filter: "drop-shadow(0 6px 20px rgba(120,255,180,0.35))",
        }}
      >
        {/* Antenna */}
        <g>
          <line
            x1="60" y1="12" x2={60 + Math.sin(frame * 0.5) * 4} y2="2"
            stroke="#78FFB4" strokeWidth="3" strokeLinecap="round"
          />
          <circle cx={60 + Math.sin(frame * 0.5) * 4} cy="2" r="5" fill="#FFE156">
            <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={60 + Math.sin(frame * 0.5) * 4} cy="2" r="8" fill="#FFE156" opacity="0.2">
            <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Body */}
        <ellipse cx="60" cy="68" rx="38" ry="42" fill={`url(#${bodyGradId})`} />
        <ellipse cx="60" cy="70" rx="32" ry="36" fill={`url(#${bodyInnerId})`} />

        {/* Spots */}
        <circle cx="38" cy="50" r="5" fill="#A5FFD6" opacity="0.4" />
        <circle cx="82" cy="50" r="5" fill="#A5FFD6" opacity="0.4" />
        <circle cx="60" cy="38" r="3" fill="#A5FFD6" opacity="0.3" />
        <circle cx="50" cy="42" r="2" fill="#A5FFD6" opacity="0.25" />
        <circle cx="70" cy="42" r="2" fill="#A5FFD6" opacity="0.25" />

        {/* Belly */}
        <ellipse cx="60" cy="78" rx="20" ry="18" fill="#8CFFCA" opacity="0.15" />

        {/* Arms */}
        {mood === "wave" ? (
          <>
            <g style={{ transform: `rotate(${Math.sin(frame) * 20 - 30}deg)`, transformOrigin: "28px 65px" }}>
              <ellipse cx="16" cy="65" rx="10" ry="6" fill="#5CE69C" />
            </g>
            <ellipse cx="104" cy="75" rx="10" ry="6" fill="#5CE69C" />
          </>
        ) : mood === "excited" || mood === "hopeful" ? (
          <>
            <ellipse cx="16" cy="55" rx="10" ry="6" fill="#5CE69C" transform="rotate(-30 16 55)" />
            <ellipse cx="104" cy="55" rx="10" ry="6" fill="#5CE69C" transform="rotate(30 104 55)" />
          </>
        ) : (
          <>
            <ellipse cx="18" cy="75" rx="10" ry="6" fill="#5CE69C" transform="rotate(15 18 75)" />
            <ellipse cx="102" cy="75" rx="10" ry="6" fill="#5CE69C" transform="rotate(-15 102 75)" />
          </>
        )}

        {/* Feet */}
        <ellipse cx="44" cy="108" rx="12" ry="6" fill="#4CC88A" />
        <ellipse cx="76" cy="108" rx="12" ry="6" fill="#4CC88A" />

        {/* Eyes */}
        <g>
          <ellipse cx={46 + eyeShift} cy="58" rx="12" ry="14" fill="white" />
          <ellipse cx={74 + eyeShift} cy="58" rx="12" ry="14" fill="white" />

          {mood === "dizzy" ? (
            <>
              <text x="40" y="63" fontSize="14" textAnchor="middle">×</text>
              <text x="68" y="63" fontSize="14" textAnchor="middle">×</text>
            </>
          ) : (
            <>
              <circle cx={48 + eyeShift} cy={58 + (mood === "sad" ? 2 : 0)} r="5" fill="#1a1a2e">
                <animate attributeName="r" values="5;4;5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={76 + eyeShift} cy={58 + (mood === "sad" ? 2 : 0)} r="5" fill="#1a1a2e">
                <animate attributeName="r" values="5;4;5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={44 + eyeShift} cy="54" r="2.5" fill="white" opacity="0.9" />
              <circle cx={72 + eyeShift} cy="54" r="2.5" fill="white" opacity="0.9" />
            </>
          )}

          {mood === "sad" && (
            <>
              <line x1="36" y1="44" x2="52" y2="40" stroke="#3a9a6a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="84" y1="44" x2="68" y2="40" stroke="#3a9a6a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {(mood === "excited" || mood === "hopeful") && (
            <>
              <line x1="36" y1="40" x2="52" y2="43" stroke="#3a9a6a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="84" y1="40" x2="68" y2="43" stroke="#3a9a6a" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Mouth */}
        {mood === "excited" || mood === "hopeful" || mood === "wave" ? (
          <path d="M 48 78 Q 60 92 72 78" stroke="#1a5a3a" strokeWidth="2.5" fill="#2a8a5a" strokeLinecap="round" />
        ) : mood === "sad" || mood === "dizzy" ? (
          <path d="M 48 84 Q 60 76 72 84" stroke="#1a5a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : speaking ? (
          <ellipse cx="60" cy="82" rx="8" ry={4 + Math.sin(frame * 2) * 3} fill="#2a8a5a" stroke="#1a5a3a" strokeWidth="1.5" />
        ) : (
          <path d="M 50 80 Q 60 88 70 80" stroke="#1a5a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Gradients */}
        <defs>
          <radialGradient id={bodyGradId} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#8CFFCA" />
            <stop offset="100%" stopColor="#3DA87A" />
          </radialGradient>
          <radialGradient id={bodyInnerId} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#78FFB4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3DA87A" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Speech indicator */}
      {speaking && (
        <div className="absolute -right-2 top-1/4 flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 4 + i * 2,
                height: 8,
                background: "#78FFB4",
                opacity: 0.5,
                animation: `soundWave 0.6s ease-in-out ${i * 0.15}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
