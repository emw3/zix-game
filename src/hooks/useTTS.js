import { useState, useCallback } from "react";

export function useTTS() {
  const [speechText, setSpeechText] = useState("");
  const [speechLang, setSpeechLang] = useState("es");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text, lang) => {
    setSpeechText(text);
    setSpeechLang(lang || "es");
    setIsSpeaking(true);
    // Auto-stop after 2.5s (placeholder — no real TTS)
    setTimeout(() => setIsSpeaking(false), 2500);
  }, []);

  return { speechText, speechLang, isSpeaking, speak };
}
