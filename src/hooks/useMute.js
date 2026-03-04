import { useState } from "react";
import { setMuted, isMuted } from "../audio/soundEngine";

export function useMute() {
  const [muted, setMutedState] = useState(isMuted());

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  return { muted, toggleMute };
}
