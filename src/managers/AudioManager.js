import { makeAutoObservable } from "mobx";

class AudioManager {
  tracks = {};
  isMuted = false;
  isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  setupTracks() {
    // Only create Audio elements on client side
    if (typeof window === "undefined") return;

    this.tracks = {
      base: new Audio("../../music/base.mp3"),
      level1: new Audio("../../music/level1.mp3"),
      level2: new Audio("/assets/music/level2.mp3"),
      level3: new Audio("/assets/music/level3.mp3"),
    };

    // Configure all tracks
    Object.values(this.tracks).forEach((track) => {
      track.loop = true;
      track.volume = 0;
      track.preload = "auto";
    });

    // Base track starts unmuted
    if (this.tracks.base) {
      this.tracks.base.volume = 0.5;
    }
  }

  async initialize() {
    if (this.isInitialized || typeof window === "undefined") return;

    // Setup tracks if not already done
    if (Object.keys(this.tracks).length === 0) {
      this.setupTracks();
    }

    try {
      // Start all tracks at the same time
      const startPromises = Object.values(this.tracks).map((track) => {
        const playPromise = track.play();
        if (playPromise !== undefined) {
          return playPromise;
        }
        return Promise.resolve();
      });

      await Promise.all(startPromises);
      this.isInitialized = true;
      console.log("Audio initialized successfully");
    } catch (error) {
      console.error("Audio initialization failed:", error);
    }
  }

  toggleMasterVolume() {
    if (typeof window === "undefined") return;

    this.isMuted = !this.isMuted;
    Object.values(this.tracks).forEach((track) => {
      track.volume = this.isMuted ? 0 : track.dataset.previousVolume || 0;
    });
    console.log("Master volume toggled:", this.isMuted ? "Muted" : "Unmuted");
  }

  setTrackVolume(trackName, volume) {
    if (typeof window === "undefined") return;

    const track = this.tracks[trackName];
    if (track) {
      track.volume = this.isMuted ? 0 : volume;
      track.dataset.previousVolume = volume;
      console.log(`Set ${trackName} volume to:`, volume);
    }
  }

  // Methods to control individual tracks
  muteTrack(trackName) {
    if (typeof window === "undefined") return;
    console.log(`Muting track: ${trackName}`);
    this.setTrackVolume(trackName, 0);
  }

  unmuteTrack(trackName, volume = 0.8) {
    // Increased default volume to 0.8
    if (typeof window === "undefined") return;
    console.log(`Unmuting track: ${trackName} at volume ${volume}`);
    this.setTrackVolume(trackName, volume);
  }

  // Level-based track management
  updateTracksBasedOnLevel(level) {
    console.log("Updating tracks for level:", level);
    if (typeof window === "undefined") return;

    switch (level) {
      case 2:
        console.log("Level 2: Unmuting level1 track");
        this.unmuteTrack("level1", 1.0); // Set to maximum volume
        break;
      case 3:
        this.unmuteTrack("level2", 1.0);
        break;
      case 4:
        this.unmuteTrack("level3", 1.0);
        break;
      default:
        // Reset to base track only
        Object.keys(this.tracks).forEach((trackName) => {
          if (trackName === "base") {
            this.unmuteTrack(trackName, 0.8);
          } else {
            this.muteTrack(trackName);
          }
        });
    }
  }
}

export const audioManager = new AudioManager();
