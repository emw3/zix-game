import { useGameState } from "./hooks/useGameState";
import { useTTS } from "./hooks/useTTS";
import { SplashScreen } from "./screens/SplashScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { MissionsScreen } from "./screens/MissionsScreen";
import { GameplayScreen } from "./screens/GameplayScreen";

export default function App() {
  const game = useGameState();
  const speech = useTTS();

  const { screen, lang, completed, SCREENS } = game;

  if (screen === SCREENS.SPLASH) {
    return (
      <SplashScreen
        onStart={(selectedLang) => {
          game.setLang(selectedLang);
          game.goToScreen(SCREENS.INTRO);
        }}
      />
    );
  }

  if (screen === SCREENS.INTRO) {
    return (
      <IntroScreen
        lang={lang}
        onComplete={() => game.goToScreen(SCREENS.MISSIONS)}
      />
    );
  }

  if (screen === SCREENS.MISSIONS) {
    return (
      <MissionsScreen
        lang={lang}
        completed={completed}
        onStartMission={(m) => {
          game.startMission(m, lang);
          const typeMessages = {
            navigate: { es: "¡Necesito recoger las piezas!", en: "I need to collect the parts!" },
            obstacles: { es: "¡Cuidado con los obstáculos!", en: "Watch out for obstacles!" },
            loops: { es: "¡Usemos patrones repetidos!", en: "Let's use repeat patterns!" },
            navigate_obstacles: { es: "¡A navegar con cuidado!", en: "Navigate carefully!" },
            navigate_loops: { es: "¡Repite y avanza!", en: "Repeat and advance!" },
            combined: { es: "¡Aventura completa!", en: "Full adventure!" },
          };
          const msg = typeMessages[m.gameType] || typeMessages.navigate;
          speech.speak(msg[lang], lang);
        }}
        onToggleLang={game.toggleLang}
      />
    );
  }

  if (screen === SCREENS.GAMEPLAY) {
    return (
      <GameplayScreen
        game={game}
        speech={speech}
        onBack={() => {
          game.goToScreen(SCREENS.MISSIONS);
        }}
      />
    );
  }

  return null;
}
