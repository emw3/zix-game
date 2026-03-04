import { useState, useRef } from "react";
import { playSound } from "../audio/soundEngine";
import { countBlocks } from "../hooks/useGameState";

export const CodeDropZone = ({
  blocks, onDrop, onRemove, onRemoveFromLoop,
  label, lang, activeIndex = -1, maxBlocks = null, t,
}) => {
  const [shaking, setShaking] = useState(false);
  const shakeTimeout = useRef(null);

  const blockCount = countBlocks(blocks);
  const isFull = maxBlocks && blockCount >= maxBlocks;

  const triggerShake = () => {
    playSound('blockReject');
    setShaking(true);
    if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
    shakeTimeout.current = setTimeout(() => setShaking(false), 400);
  };

  // Check if active index matches a block or child
  const isBlockActive = (blockIdx) => {
    if (activeIndex === -1 || typeof activeIndex !== "object") return false;
    return activeIndex.blockIndex === blockIdx && activeIndex.childIndex === -1;
  };
  const isLoopActive = (blockIdx) => {
    if (activeIndex === -1 || typeof activeIndex !== "object") return false;
    return activeIndex.blockIndex === blockIdx;
  };
  const isChildActive = (blockIdx, childIdx) => {
    if (activeIndex === -1 || typeof activeIndex !== "object") return false;
    return activeIndex.blockIndex === blockIdx && activeIndex.childIndex === childIdx;
  };

  const renderBlock = (block, i) => (
    <div
      key={i}
      className="flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${block.color}dd, ${block.color}aa)`,
        animation: "slideIn 0.2s ease-out",
        boxShadow: isBlockActive(i)
          ? `0 0 16px ${block.color}aa, 0 2px 8px ${block.color}44`
          : `0 2px 8px ${block.color}44`,
        outline: isBlockActive(i) ? `2px solid ${block.color}` : "none",
      }}
      onClick={() => onRemove(i)}
    >
      <span className="text-xs font-bold w-5 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        {i + 1}
      </span>
      <span className="text-sm">{block.icon}</span>
      <span className="text-white font-semibold text-sm flex-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
        {lang === "es" ? block.es : block.en}
      </span>
      <span className="text-white opacity-0 group-hover:opacity-60 text-xs transition-opacity">✕</span>
    </div>
  );

  const renderLoopBlock = (block, i) => {
    const child = block.children?.[0];
    const loopActive = isLoopActive(i);

    return (
      <div
        key={i}
        className="rounded-xl overflow-hidden"
        style={{
          borderLeft: `4px solid ${block.color}`,
          animation: loopActive ? `loopPulse 1.2s ease-in-out infinite` : "slideIn 0.2s ease-out",
        }}
      >
        {/* Loop header */}
        <div
          className="flex items-center gap-2 rounded-tr-lg px-3 py-2 cursor-pointer group"
          style={{
            background: `linear-gradient(135deg, ${block.color}dd, ${block.color}aa)`,
            boxShadow: loopActive
              ? `0 0 16px ${block.color}aa, 0 2px 8px ${block.color}44`
              : `0 2px 8px ${block.color}44`,
          }}
          onClick={() => onRemove(i)}
        >
          <span className="text-xs font-bold w-5 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            {i + 1}
          </span>
          <span className="text-sm">{block.icon}</span>
          <span className="text-white font-semibold text-sm flex-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {lang === "es" ? block.es : block.en}
          </span>
          <span className="text-white opacity-0 group-hover:opacity-60 text-xs transition-opacity">✕</span>
        </div>

        {/* Inner slot */}
        <div
          className="rounded-br-lg p-2"
          style={{
            background: `${block.color}1e`,
            borderRight: `1px dashed ${block.color}44`,
            borderBottom: `1px dashed ${block.color}44`,
          }}
        >
          {!child && (
            <div
              className="flex items-center justify-center rounded-lg py-2"
              style={{
                border: `1px dashed ${block.color}55`,
                color: `${block.color}88`,
                minHeight: 36,
              }}
            >
              <span className="text-xs">
                {lang === "es" ? "Toca una accion" : "Tap an action"}
              </span>
            </div>
          )}
          {child && (
            <div
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer group"
              style={{
                background: `linear-gradient(135deg, ${child.color}cc, ${child.color}99)`,
                animation: "innerSlideIn 0.2s ease-out",
                boxShadow: isChildActive(i, 0)
                  ? `0 0 12px ${child.color}aa, 0 1px 4px ${child.color}44`
                  : `0 1px 4px ${child.color}44`,
                outline: isChildActive(i, 0) ? `2px solid ${child.color}` : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromLoop(i, 0);
              }}
            >
              <span className="text-xs">{child.icon}</span>
              <span className="text-white font-semibold text-xs flex-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {lang === "es" ? child.es : child.en}
              </span>
              <span className="text-white opacity-0 group-hover:opacity-60 text-xs transition-opacity">✕</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div
        data-testid="drop-zone"
        onDragOver={(e) => {
          e.preventDefault();
          if (isFull) {
            e.currentTarget.style.borderColor = "rgba(255,107,138,0.5)";
          } else {
            e.currentTarget.style.borderColor = "rgba(120,255,180,0.5)";
          }
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          if (isFull) {
            triggerShake();
            return;
          }
          const blockId = e.dataTransfer.getData("blockId");
          if (blockId) onDrop(blockId);
        }}
        className="rounded-2xl p-3 flex flex-col gap-1.5 transition-all overflow-y-auto flex-1 min-h-0"
        style={{
          background: "rgba(0,0,0,0.25)",
          border: "2px dashed rgba(255,255,255,0.2)",
          minHeight: 160,
          backdropFilter: "blur(8px)",
          animation: shaking ? "shakeReject 0.4s ease-out" : "none",
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs uppercase tracking-widest font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
            {label}
          </div>
          {maxBlocks && t && (
            <div
              className="text-xs font-bold px-2 py-0.5 rounded-full transition-colors"
              style={{
                color: isFull ? "#FF6B8A" : "rgba(255,255,255,0.5)",
                background: isFull ? "rgba(255,107,138,0.15)" : "rgba(255,255,255,0.08)",
              }}
            >
              {blockCount} / {maxBlocks} {t.blockLimit}
            </div>
          )}
        </div>
        {blocks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6" style={{ color: "rgba(255,255,255,0.2)" }}>
            <span className="text-3xl">📥</span>
            <span className="text-xs">Drag & drop</span>
          </div>
        )}
        {blocks.length > 0 && isFull && t && (
          <div className="text-center text-xs font-bold mb-1" style={{ color: "#FF6B8A" }}>
            {t.blockLimitFull}
          </div>
        )}
        {blocks.map((block, i) =>
          block.type === "loop" ? renderLoopBlock(block, i) : renderBlock(block, i)
        )}
      </div>
      {/* Scroll fade affordance */}
      {blocks.length > 4 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-8 rounded-b-2xl pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
        />
      )}
    </div>
  );
};
