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
      // This is important for allowing multiple tracks to play simultaneously
      track.preservesPitch = false;
      // Ensure tracks keep playing even if not "visible"
      track.playsInline = true;
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
      // Start all tracks simultaneously
      await Promise.all(
        Object.values(this.tracks).map(async (track) => {
          try {
            // Force play even if other audio is playing
            track.mozPreservesPitch = false; // Firefox
            track.webkitPreservesPitch = false; // Safari
            await track.play();
          } catch (e) {
            console.error("Track play error:", e);
          }
        })
      );

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
      // Ensure the track is playing
      if (track.paused) {
        track.play().catch((e) => console.error("Error playing track:", e));
      }
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
        // Keep base track playing but quieter

        this.setTrackVolume("base", 0.5);
        this.unmuteTrack("level1", 0.5);
        this.toggleMasterVolume();
        break;
      case 3:
        this.setTrackVolume("base", 0.2);
        this.setTrackVolume("level1", 0.5);
        this.unmuteTrack("level2", 0.7);
        break;
      case 4:
        this.setTrackVolume("base", 0.2);
        this.setTrackVolume("level1", 0.4);
        this.setTrackVolume("level2", 0.4);
        this.unmuteTrack("level3", 0.7);
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
