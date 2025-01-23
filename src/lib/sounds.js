const isBrowser = typeof window !== "undefined";

const createSounds = () => {
  if (!isBrowser) return {};

  return {
    // Todo sounds
    todoComplete: new Audio("/sounds/complete.mp3"),
    todoUndo: new Audio("/sounds/undo.mp3"),

    // Habit sounds
    habitComplete: new Audio("/sounds/habit-complete.mp3"),
    habitUndo: new Audio("/sounds/habit-undo.mp3"),
  };
};

const sounds = createSounds();

export const playSound = (soundName) => {
  if (!isBrowser) return;

  const sound = sounds[soundName];
  if (sound) {
    sound.currentTime = 0;
    sound.volume = 1.0;
    sound.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
  }
};

// Preload sounds
if (isBrowser) {
  Object.values(sounds).forEach((sound) => {
    sound.load();
  });
}
