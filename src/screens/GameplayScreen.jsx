import { useRef, useCallback, useEffect } from "react";
import { LANG } from "../data/i18n";
import { executeBlocks } from "../engine/execute";
import { Particles } from "../components/Particles";
import { CelebrationParticles } from "../components/Particles";
import { ZixCharacter } from "../components/ZixCharacter";
import { SpeechBubble } from "../components/SpeechBubble";
import { GameWorld } from "../components/GameWorld";
import { CodeBlock } from "../components/CodeBlock";
import { CodeDropZone } from "../components/CodeDropZone";
import { ResultOverlay } from "../components/ResultOverlay";
import { playSound } from "../audio/soundEngine";

export const GameplayScreen = ({
  game,
  speech,
  onBack,
  muted,
  toggleMute,
}) => {
  const {
    mission, lang, droppedBlocks, alienPos, collectedItems,
    isMoving, isRunning, showResult, currentStepIndex,
    addBlock, removeBlock, removeBlockFromLoop,
    resetMission, completeMission,
    setAlienPos, setCollectedItems, setIsMoving, setIsRunning,
    setShowResult, setCurrentStepIndex,
  } = game;

  const { speechText, speechLang, isSpeaking, speak } = speech;
  const t = LANG[lang];
  const intervalRef = useRef(null);
  const currentStepTypeRef = useRef(null);
  const expandedMapRef = useRef(null);

  // Speak hint when mission loads (if hint exists)
  useEffect(() => {
    if (mission?.hint) {
      const hintText = lang === "es" ? mission.hint.es : mission.hint.en;
      speak(hintText, lang);
    }
  }, [mission?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDrop = useCallback((blockId) => {
    if (!mission || isRunning) return;
    const block = mission.blocks.find((b) => b.id === blockId);
    if (block) {
      playSound('blockAdd');
      addBlock({ ...block });
    }
  }, [mission, isRunning, addBlock]);

  const handleBlockClick = useCallback((blockId) => handleDrop(blockId), [handleDrop]);

  const handleRemoveFromLoop = useCallback((loopIndex, childIndex) => {
    if (isRunning) return;
    playSound('blockRemove');
    removeBlockFromLoop(loopIndex, childIndex);
  }, [isRunning, removeBlockFromLoop]);

  const runCode = useCallback(() => {
    if (!mission || droppedBlocks.length === 0 || isRunning) return;

    const { steps, success, expandedToOriginal } = executeBlocks(droppedBlocks, mission);
    expandedMapRef.current = expandedToOriginal;

    setIsRunning(true);
    playSound('play');
    speak(lang === "es" ? "¡Allá voy!" : "Here I go!", lang);

    let stepIdx = 0;
    let prevCollectedCount = 0;

    intervalRef.current = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(intervalRef.current);
        setIsMoving(false);
        setCurrentStepIndex(-1);
        currentStepTypeRef.current = null;

        setTimeout(() => {
          setIsRunning(false);
          if (success) {
            playSound('success');
            setShowResult("success");
            speak(lang === "es" ? "¡Lo logramos! 🎉" : "We did it! 🎉", lang);
          } else {
            playSound('fail');
            setShowResult("fail");
            speak(lang === "es" ? "Hmm... algo falló 🐛" : "Hmm... something's wrong 🐛", lang);
          }
        }, 400);
        return;
      }

      const step = steps[stepIdx];
      setIsMoving(true);
      currentStepTypeRef.current = step.type;

      // Map expanded step index back to original dropped block index
      const origMapping = expandedMapRef.current?.[stepIdx];
      const activeIdx = origMapping ?? { blockIndex: Math.min(stepIdx, droppedBlocks.length - 1), childIndex: -1 };
      setCurrentStepIndex(activeIdx);

      setAlienPos({ ...step.pos });

      if (step.collected) {
        if (step.collected.length > prevCollectedCount) {
          playSound('collect');
        }
        prevCollectedCount = step.collected.length;
        setCollectedItems([...step.collected]);
      }

      if (step.type === "wall") {
        playSound('wall');
      } else if (step.type === "move") {
        playSound('step');
      }

      if (step.type === "crash") {
        playSound('crash');
        clearInterval(intervalRef.current);
        setIsMoving(false);
        currentStepTypeRef.current = null;
        setTimeout(() => {
          setIsRunning(false);
          playSound('fail');
          setShowResult("fail");
          speak(lang === "es" ? "¡Auch! 💥" : "Ouch! 💥", lang);
        }, 400);
        return;
      }

      stepIdx++;
      setTimeout(() => setIsMoving(false), 250);
    }, 600);
  }, [mission, droppedBlocks, isRunning, lang, speak, setIsRunning, setIsMoving, setCurrentStepIndex, setAlienPos, setCollectedItems, setShowResult]);

  const handleResultAction = useCallback(() => {
    if (showResult === "success") {
      completeMission();
    } else {
      resetMission();
    }
  }, [showResult, completeMission, resetMission]);

  if (!mission) return null;

  return (
    <div
      className="min-h-screen p-3 relative overflow-x-hidden flex flex-col"
      style={{ background: mission.bg, fontFamily: "'Fredoka', sans-serif" }}
    >
      <Particles type={mission.theme === "forest" ? "fireflies" : "stars"} count={20} />
      {showResult === "success" && <CelebrationParticles />}

      <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            ← {t.back}
          </button>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-bold px-3 py-1.5 rounded-xl"
              style={{ background: `${mission.color}25`, color: mission.color, border: `1px solid ${mission.color}44` }}
            >
              {mission.icon} {t.missionLabel} {mission.id}: {lang === "es" ? mission.concept : mission.conceptEN}
            </span>
            <button
              onClick={() => { playSound('click'); toggleMute(); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
              title={muted ? t.unmute : t.mute}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={game.toggleLang}
              className="px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              {lang === "es" ? "🇪🇸→🇺🇸" : "🇺🇸→🇪🇸"}
            </button>
          </div>
        </div>

        {/* Zix + Speech */}
        <div className="flex items-end gap-3 mb-3 ml-2">
          <ZixCharacter mood={isRunning ? "wave" : showResult === "success" ? "excited" : showResult === "fail" ? "sad" : "idle"} size={70} speaking={isSpeaking} />
          {speechText && <SpeechBubble text={speechText} lang={speechLang} />}
        </div>

        {/* Main gameplay area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Game World */}
          <div className="lg:col-span-5 flex items-start justify-center">
            <GameWorld
              mission={mission}
              alienPos={alienPos}
              collectedItems={collectedItems}
              isMoving={isMoving}
              currentStepType={currentStepTypeRef.current}
            />
          </div>

          {/* Blocks palette */}
          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              📦 {t.blocks}
            </div>
            <div className="flex flex-col gap-2">
              {mission.blocks.map((block) => (
                <CodeBlock
                  key={block.id}
                  id={block.id}
                  icon={block.icon}
                  label={lang === "es" ? block.es : block.en}
                  color={block.color}
                  type={block.type}
                  onClick={handleBlockClick}
                />
              ))}
            </div>
          </div>

          {/* Code zone */}
          <div className="lg:col-span-4 h-full flex flex-col gap-2">
            <CodeDropZone
              blocks={droppedBlocks}
              onDrop={handleDrop}
              onRemove={(i) => { if (!isRunning) { playSound('blockRemove'); removeBlock(i); } }}
              onRemoveFromLoop={handleRemoveFromLoop}
              label={`🧩 ${t.yourCode}`}
              lang={lang}
              activeIndex={currentStepIndex}
              maxBlocks={mission.maxBlocks}
              t={t}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { playSound('clear'); resetMission(); }}
                disabled={isRunning}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  opacity: isRunning ? 0.4 : 1,
                }}
              >
                🗑️ {t.clear}
              </button>
              <button
                onClick={runCode}
                disabled={droppedBlocks.length === 0 || isRunning}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: droppedBlocks.length > 0 && !isRunning
                    ? "linear-gradient(135deg, #78FFB4, #4ECDC4)"
                    : "rgba(255,255,255,0.05)",
                  color: droppedBlocks.length > 0 && !isRunning ? "#1a1a2e" : "rgba(255,255,255,0.2)",
                  boxShadow: droppedBlocks.length > 0 && !isRunning ? "0 4px 20px rgba(120,255,180,0.35)" : "none",
                  opacity: droppedBlocks.length === 0 || isRunning ? 0.4 : 1,
                }}
              >
                ▶️ {t.run}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showResult && (
        <ResultOverlay result={showResult} t={t} onAction={handleResultAction} />
      )}
    </div>
  );
};
