// Sound engine — Web Audio API synthesized sounds, no audio files
let ctx = null;
let muted = localStorage.getItem("zix-muted") === "true";

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function unlockAudio() {
  getCtx();
}

export function setMuted(val) {
  muted = val;
  localStorage.setItem("zix-muted", val ? "true" : "false");
}

export function isMuted() {
  return muted;
}

function tone(freq, duration, type = "sine", volume = 0.3) {
  if (muted) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

function noise(duration, volume = 0.15) {
  if (muted) return;
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  src.connect(gain);
  gain.connect(c.destination);
  src.start(c.currentTime);
  src.stop(c.currentTime + duration);
}

const sounds = {
  click() {
    tone(880, 0.08, "sine", 0.2);
  },
  blockAdd() {
    tone(440, 0.06, "triangle", 0.25);
    setTimeout(() => tone(660, 0.06, "triangle", 0.25), 60);
  },
  blockRemove() {
    tone(660, 0.06, "triangle", 0.2);
    setTimeout(() => tone(440, 0.06, "triangle", 0.2), 60);
  },
  blockReject() {
    tone(150, 0.2, "square", 0.15);
  },
  play() {
    tone(523, 0.08, "sine", 0.25);
    setTimeout(() => tone(659, 0.08, "sine", 0.25), 100);
    setTimeout(() => tone(784, 0.12, "sine", 0.25), 200);
  },
  step() {
    tone(600, 0.06, "sine", 0.1);
  },
  collect() {
    if (muted) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, c.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.25);
  },
  crash() {
    if (muted) return;
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.3);
  },
  wall() {
    tone(120, 0.15, "sine", 0.25);
  },
  success() {
    tone(523, 0.1, "sine", 0.25);
    setTimeout(() => tone(659, 0.1, "sine", 0.25), 120);
    setTimeout(() => tone(784, 0.1, "sine", 0.25), 240);
    setTimeout(() => tone(1047, 0.25, "sine", 0.3), 360);
  },
  fail() {
    tone(440, 0.12, "sine", 0.2);
    setTimeout(() => tone(370, 0.12, "sine", 0.2), 140);
    setTimeout(() => tone(330, 0.2, "sine", 0.15), 280);
  },
  levelSelect() {
    tone(523, 0.07, "sine", 0.2);
    setTimeout(() => tone(784, 0.08, "sine", 0.25), 70);
  },
  clear() {
    noise(0.2, 0.12);
  },
};

export function playSound(id) {
  if (muted) return;
  try {
    sounds[id]?.();
  } catch {
    // silently ignore audio errors
  }
}
