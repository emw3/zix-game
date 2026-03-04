import { useRef } from "react";

export const Particles = ({ type = "stars", count = 30 }) => {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    }))
  ).current;

  if (type === "fireflies") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 15).map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size + 2,
              height: p.size + 2,
              left: `${p.x}%`,
              top: `${50 + p.y * 0.5}%`,
              background: "radial-gradient(circle, #ffe87c, #ffe87c00)",
              boxShadow: "0 0 8px 2px #ffe87c88",
              animation: `firefly ${p.duration + 3}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export const CelebrationParticles = () => {
  const emojis = ["⭐", "🎉", "✨", "💫", "🌟", "🎊", "💚"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            animation: `confettiFall ${2 + Math.random() * 3}s linear ${Math.random() * 1.5}s forwards`,
          }}
        >
          {emojis[i % emojis.length]}
        </div>
      ))}
    </div>
  );
};
