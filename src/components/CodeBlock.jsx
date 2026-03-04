export const CodeBlock = ({ icon, label, color, id, onClick }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData("blockId", id);
    }}
    onClick={() => onClick && onClick(id)}
    className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-grab active:cursor-grabbing select-none"
    style={{
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      boxShadow: `0 4px 14px ${color}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
      fontFamily: "'Fredoka', sans-serif",
      fontSize: "0.9rem",
      color: "#fff",
      fontWeight: 600,
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
      e.currentTarget.style.boxShadow = `0 8px 24px ${color}66, inset 0 1px 0 rgba(255,255,255,0.2)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = `0 4px 14px ${color}55, inset 0 1px 0 rgba(255,255,255,0.2)`;
    }}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </div>
);
