import { LANG } from "../data/i18n";
import { getMission } from "../data/missions";
import { Particles } from "../components/Particles";
import { ZixCharacter } from "../components/ZixCharacter";
import { playSound } from "../engine/soundEngine";

export const MissionsScreen = ({ lang, completed, onStartMission, onToggleLang, muted, toggleMute }) => {
  const t = LANG[lang];

  // Show completed levels + next 3 unlocked
  const maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
  const visibleCount = Math.max(maxCompleted + 3, 5);
  const levels = [];
  for (let i = 1; i <= visibleCount; i++) {
    levels.push(getMission(i));
  }

  return (
    <div
      className="min-h-screen p-5 relative overflow-auto"
      style={{ background: "linear-gradient(180deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)", fontFamily: "'Fredoka', sans-serif" }}
    >
      <Particles type="stars" count={35} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          <ZixCharacter mood="idle" size={55} />
          <div>
            <h2 className="text-2xl font-bold text-white">{t.missions}</h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              {completed.length} {t.completed}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { playSound('click'); toggleMute(); }}
            className="px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            title={muted ? t.unmute : t.mute}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={() => { playSound('click'); onToggleLang(); }}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {lang === "es" ? "🇪🇸 → 🇺🇸" : "🇺🇸 → 🇪🇸"}
          </button>
        </div>
      </div>

      {/* Mission cards */}
      <div className="relative z-10 flex flex-col items-center gap-3 max-w-lg mx-auto pb-8">
        {levels.map((m, i) => {
          const unlocked = i === 0 || completed.includes(i) || completed.includes(m.id - 1);
          const done = completed.includes(m.id);
          const prevMission = i > 0 ? levels[i - 1] : null;

          return (
            <div key={m.id} className="w-full">
              {i > 0 && (
                <div className="flex justify-center -my-1">
                  <div
                    className="w-1 h-8 rounded-full"
                    style={{
                      background: done || unlocked
                        ? `linear-gradient(180deg, ${prevMission.color}, ${m.color})`
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              )}

              <button
                onClick={() => { if (unlocked) { playSound('levelSelect'); onStartMission(m); } }}
                className="w-full text-left rounded-2xl p-5 transition-all active:scale-98"
                style={{
                  background: done
                    ? `linear-gradient(135deg, ${m.color}22, ${m.color}11)`
                    : unlocked
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.02)",
                  border: done
                    ? `2px solid ${m.color}88`
                    : unlocked
                    ? "2px solid rgba(255,255,255,0.12)"
                    : "2px solid rgba(255,255,255,0.04)",
                  opacity: unlocked ? 1 : 0.35,
                  cursor: unlocked ? "pointer" : "default",
                  boxShadow: done ? `0 4px 20px ${m.color}22` : "none",
                }}
                onMouseEnter={(e) => unlocked && (e.currentTarget.style.transform = "scale(1.02) translateY(-2px)")}
                onMouseLeave={(e) => unlocked && (e.currentTarget.style.transform = "scale(1)")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative"
                    style={{
                      background: unlocked ? `linear-gradient(135deg, ${m.color}44, ${m.color}22)` : "rgba(255,255,255,0.03)",
                      boxShadow: done ? `0 0 20px ${m.color}33` : "none",
                    }}
                  >
                    {done ? "✅" : unlocked ? m.icon : "🔒"}
                    {done && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        style={{ background: "#78FFB4", color: "#1a1a2e" }}
                      >
                        ⭐
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t.missionLabel} {m.id}
                    </div>
                    <h3 className="text-white font-bold text-lg truncate">
                      {lang === "es" ? m.titleES : m.titleEN}
                    </h3>
                    <p className="text-sm truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {lang === "es" ? m.descES : m.descEN}
                    </p>
                    <span
                      className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-2"
                      style={{ background: `${m.color}25`, color: m.color }}
                    >
                      📚 {lang === "es" ? m.concept : m.conceptEN}
                    </span>
                  </div>
                  {unlocked && !done && (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                      style={{ background: `${m.color}22`, animation: "pulseGlow 2s ease-in-out infinite" }}
                    >
                      ▶️
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Ship progress */}
      <div className="relative z-10 mt-4 max-w-lg mx-auto pb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            🛸 {t.shipProgress}
          </span>
          <span className="text-sm font-bold" style={{ color: "#78FFB4" }}>
            {completed.length} {lang === "es" ? "piezas" : "parts"}
          </span>
        </div>
        <div className="h-4 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${Math.min(Math.max(completed.length * 5, 3), 100)}%`,
              background: "linear-gradient(90deg, #78FFB4, #FFE156, #FF6B8A)",
              boxShadow: "0 0 15px rgba(120,255,180,0.4)",
            }}
          >
            {completed.length > 0 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-sm">🚀</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
