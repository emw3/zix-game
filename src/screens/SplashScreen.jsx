import { useState, useEffect } from "react";
import { Particles } from "../components/Particles";
import { ZixCharacter } from "../components/ZixCharacter";

export const SplashScreen = ({ onStart }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 500);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #24243e 100%)", fontFamily: "'Fredoka', sans-serif" }}
    >
      <Particles type="stars" count={50} />

      <div
        className="relative z-10 flex flex-col items-center gap-4"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
          transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="relative">
          <div
            className="absolute rounded-full"
            style={{
              width: 240,
              height: 240,
              top: -30,
              left: -50,
              background: "radial-gradient(circle, rgba(120,255,180,0.08) 0%, transparent 60%)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          />
          <ZixCharacter mood="wave" size={140} speaking />
        </div>

        <h1
          className="text-7xl font-bold tracking-tight"
          style={{
            background: "linear-gradient(135deg, #78FFB4 0%, #FFE156 50%, #FF6B8A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 4px 20px rgba(120,255,180,0.3))",
          }}
        >
          ZIX
        </h1>
        <p className="text-base tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>
          ✨ Code your way home ✨
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => onStart("es")}
            className="px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #FFE156, #FFB347)",
              color: "#1a1a2e",
              boxShadow: "0 6px 30px rgba(255,225,86,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🇪🇸 ¡Jugar!
          </button>
          <button
            onClick={() => onStart("en")}
            className="px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #78B4FF, #4ECDC4)",
              color: "#1a1a2e",
              boxShadow: "0 6px 30px rgba(120,180,255,0.4), inset 0 2px 0 rgba(255,255,255,0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05) translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🇺🇸 Play!
          </button>
        </div>
      </div>

      <div className="absolute top-12 right-16 text-4xl" style={{ animation: "itemBob 4s ease-in-out infinite" }}>🪐</div>
      <div className="absolute bottom-20 left-10 text-2xl" style={{ animation: "itemBob 3s ease-in-out 1s infinite" }}>🌙</div>
      <div className="absolute top-20 left-20 text-xl" style={{ animation: "itemBob 5s ease-in-out 0.5s infinite" }}>⭐</div>
    </div>
  );
};
