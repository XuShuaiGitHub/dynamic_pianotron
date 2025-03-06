// 定义各自然音相对于C的半音偏移
const noteOffsets = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

// 键盘映射，每个键映射到音符和相对于基准八度的偏移
const keyMap = {
  a: { note: "C", octaveOffset: 0 },
  w: { note: "C#", octaveOffset: 0 },
  s: { note: "D", octaveOffset: 0 },
  e: { note: "D#", octaveOffset: 0 },
  d: { note: "E", octaveOffset: 0 },
  f: { note: "F", octaveOffset: 0 },
  t: { note: "F#", octaveOffset: 0 },
  g: { note: "G", octaveOffset: 0 },
  y: { note: "G#", octaveOffset: 0 },
  h: { note: "A", octaveOffset: 0 },
  u: { note: "A#", octaveOffset: 0 },
  j: { note: "B", octaveOffset: 0 },
  k: { note: "C", octaveOffset: 1 }, // “k”键代表高一个八度的C
};

let baseOctave = 4;
let transpose = 0;

function updateDisplay() {
  document.getElementById(
    "current-octave"
  ).textContent = `当前基准八度: ${baseOctave}`;
  document.getElementById(
    "current-transpose"
  ).textContent = `当前转调: ${transpose}`;
}

// 计算音符频率：f = 440 × 2^((effectiveSemitone)/12)
function getFrequency(note, octave) {
  const semitoneDiff =
    (octave - 4) * 12 + (noteOffsets[note] - noteOffsets["A"]) + transpose;
  return 440 * Math.pow(2, semitoneDiff / 12);
}

// 播放音符
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator;

function playNote(note, octave) {
  oscillator?.stop();
  const freq = getFrequency(note, octave);
  oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = freq;
  oscillator.type = "sine";

  const now = audioContext.currentTime;
  gainNode.gain.cancelScheduledValues(now);
  // 在当前时间立即将增益值设为0，即音量为0
  gainNode.gain.setValueAtTime(0, now);
  // 在0.1秒内使增益值线性上升到1
  gainNode.gain.linearRampToValueAtTime(1, now + 0.1);
  // now+0.5秒后，将增益设置为1
  gainNode.gain.setValueAtTime(1, now + 0.5);
  // 在 now+0.45 到 now+0.7 之间，使增益值线性下降到0
  gainNode.gain.linearRampToValueAtTime(0, now + 0.7);

  oscillator.start(now);
  oscillator.stop(now + 0.7);
}

// 显示跳动音符的动画效果
function showFloatingNote(note, octave, keyElement) {
  const container = document.getElementById("notes-container");
  const noteDiv = document.createElement("div");
  noteDiv.className = "floating-note";
  // noteDiv.textContent = note + octave; // 如 "C4"
  noteDiv.innerHTML = '<span class="music-note-icon">🎵</span>';

  // 以琴键位置为基准
  const rect = keyElement.getBoundingClientRect();
  noteDiv.style.left = rect.left + rect.width / 2 + "px";
  noteDiv.style.top = rect.top - 30 + "px"; // 显示在琴键上方30px处

  container.appendChild(noteDiv);
  // 动画结束后移除元素（动画时长1秒）
  setTimeout(() => {
    container.removeChild(noteDiv);
  }, 1000);
}

// 键盘事件监听
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (keyMap[key]) {
    const { note, octaveOffset } = keyMap[key];
    const effectiveOctave = baseOctave + octaveOffset;
    playNote(note, effectiveOctave);
    const keyElement = document.querySelector(`.key[data-key="${key}"]`);
    if (keyElement) {
      keyElement.classList.add("active");
      showFloatingNote(note, effectiveOctave, keyElement);
      setTimeout(() => {
        keyElement.classList.remove("active");
      }, 200);
    }
  }
});

// 鼠标点击事件
document.querySelectorAll(".key").forEach((keyEl) => {
  keyEl.addEventListener("click", () => {
    const key = keyEl.getAttribute("data-key");
    if (keyMap[key]) {
      const { note, octaveOffset } = keyMap[key];
      const effectiveOctave = baseOctave + octaveOffset;
      playNote(note, effectiveOctave);
      keyEl.classList.add("active");
      showFloatingNote(note, effectiveOctave, keyEl);
      setTimeout(() => {
        keyEl.classList.remove("active");
      }, 200);
    }
  });
});

// 控制面板按钮
document.getElementById("octave-up").addEventListener("click", () => {
  baseOctave++;
  updateDisplay();
});
document.getElementById("octave-down").addEventListener("click", () => {
  baseOctave--;
  updateDisplay();
});
document.getElementById("transpose-up").addEventListener("click", () => {
  transpose++;
  updateDisplay();
});
document.getElementById("transpose-down").addEventListener("click", () => {
  transpose--;
  updateDisplay();
});

updateDisplay();

g, g, h, h, g, g, d, d;
d, f, g, h, g, f, d, s;
