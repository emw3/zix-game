import { ZixCharacter } from "./ZixCharacter";

export const ResultOverlay = ({ result, t, onAction }) => {
  const isSuccess = result === "success";

  return (
    <div
      data-testid="result-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", animation: "popIn 0.3s ease-out" }}
    >
      <div
        className="rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        style={{
          background: isSuccess
            ? "linear-gradient(135deg, #0a2a1a 0%, #1a3a2a 50%, #0a2a3a 100%)"
            : "linear-gradient(135deg, #2a1a0a 0%, #3a1a1a 50%, #2a0a1a 100%)",
          border: `3px solid ${isSuccess ? "#78FFB488" : "#FF6B8A88"}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${isSuccess ? "rgba(120,255,180,0.15)" : "rgba(255,107,138,0.15)"}`,
        }}
      >
        <ZixCharacter
          mood={isSuccess ? "excited" : "sad"}
          size={110}
          className="mx-auto"
        />
        <h3 className="text-3xl font-bold text-white mt-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {isSuccess ? t.success : t.fail} {isSuccess ? "🎉" : "🐛"}
        </h3>
        <p className="text-sm mt-2 mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
          {isSuccess ? t.successSub : t.failSub}
        </p>
        <button
          data-testid="result-action"
          onClick={onAction}
          className="px-10 py-3.5 rounded-2xl font-bold text-lg transition-all active:scale-95"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: isSuccess
              ? "linear-gradient(135deg, #78FFB4, #4ECDC4)"
              : "linear-gradient(135deg, #FFE156, #FFB347)",
            color: "#1a1a2e",
            boxShadow: `0 6px 24px ${isSuccess ? "rgba(120,255,180,0.4)" : "rgba(255,225,86,0.4)"}`,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isSuccess ? t.nextMission : t.debug}
        </button>
      </div>
    </div>
  );
};
