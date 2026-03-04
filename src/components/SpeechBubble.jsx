import { useState, useEffect } from "react";

export const SpeechBubble = ({ text, lang, visible = true }) => {
  const [displayText, setDisplayText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        setDone(true);
        clearInterval(iv);
      }
    }, 35);
    return () => clearInterval(iv);
  }, [text]);

  if (!visible) return null;

  return (
    <div
      className="relative"
      style={{ animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
    >
      <div
        className="rounded-2xl px-5 py-3 max-w-xs relative"
        style={{
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,1)",
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "1.05rem",
          color: "#1a1a2e",
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {displayText}
        {!done && <span className="animate-pulse ml-0.5">|</span>}
      </div>
      <div
        className="absolute -bottom-2 left-6 w-5 h-5 rotate-45"
        style={{ background: "rgba(255,255,255,0.95)" }}
      />
      <div
        className="mt-1.5 ml-1 text-xs font-bold tracking-widest uppercase"
        style={{ color: lang === "es" ? "#FFE156" : "#78B4FF", opacity: 0.8 }}
      >
        {lang === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
      </div>
    </div>
  );
};
