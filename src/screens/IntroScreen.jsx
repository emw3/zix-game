import { useState } from "react";
import { INTRO_LINES, LANG } from "../data/i18n";
import { Particles } from "../components/Particles";
import { ZixCharacter } from "../components/ZixCharacter";
import { SpeechBubble } from "../components/SpeechBubble";
import { playSound } from "../engine/soundEngine";

export const IntroScreen = ({ lang, onComplete }) => {
  const [introStep, setIntroStep] = useState(0);
  const t = LANG[lang];
  const lines = INTRO_LINES[lang];
  const current = lines[introStep];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0f0c29 0%, #1a1a4e 40%, #0a3a1a 100%)", fontFamily: "'Fredoka', sans-serif" }}
    >
      <Particles type="stars" count={30} />
      {introStep === 0 && <Particles type="fireflies" count={10} />}

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        {introStep === 0 && (
          <div
            className="absolute -top-20 text-6xl"
            style={{ animation: "shake 0.5s ease-in-out" }}
          >
            💥
          </div>
        )}

        <ZixCharacter mood={current.mood} size={150} speaking />
        <SpeechBubble text={current.text} lang={lang} />

        <div className="flex gap-3 mt-2">
          {lines.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === introStep ? 28 : 10,
                height: 10,
                background: i === introStep ? "#78FFB4" : i < introStep ? "#78FFB466" : "rgba(255,255,255,0.15)",
                boxShadow: i === introStep ? "0 0 12px rgba(120,255,180,0.5)" : "none",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            playSound('click');
            if (introStep < lines.length - 1) setIntroStep(introStep + 1);
            else onComplete();
          }}
          className="mt-4 px-10 py-3.5 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{
            background: introStep === lines.length - 1
              ? "linear-gradient(135deg, #78FFB4, #4ECDC4)"
              : "rgba(255,255,255,0.12)",
            color: introStep === lines.length - 1 ? "#1a1a2e" : "#fff",
            boxShadow: introStep === lines.length - 1 ? "0 6px 30px rgba(120,255,180,0.4)" : "none",
            border: introStep === lines.length - 1 ? "none" : "1px solid rgba(255,255,255,0.15)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {introStep === lines.length - 1 ? t.letsgo : t.next}
        </button>
      </div>
    </div>
  );
};
