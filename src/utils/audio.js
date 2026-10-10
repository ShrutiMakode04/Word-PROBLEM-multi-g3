import { audioFiles } from './audioAssets';

class AudioController {
  constructor() {
    this.currentAudio = null;
    this.currentKey = null;
    this.cache = new Map();
    this.isMuted = false;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Preload all audio on startup
  preload() {
    Object.values(audioFiles).forEach(path => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.cache.set(path, audio);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.currentAudio) this.currentAudio.pause();
    } else {
      if (this.currentAudio) this.currentAudio.play().catch(e => console.warn(e));
      else if (this.currentKey) this.play(this.currentKey);
    }
    return this.isMuted;
  }

  play(key, options = { forceRestart: true }) {
    if (this.isMuted) return;
    
    if (!audioFiles[key]) {
      console.warn(`Audio key not found: ${key}`);
      return;
    }

    // Stop current playing audio
    this.stop();

    const path = audioFiles[key];
    const audio = this.cache.get(path) || new Audio(path);
    
    if (!this.cache.has(path)) {
      this.cache.set(path, audio);
    }

    if (options.forceRestart) {
      audio.currentTime = 0;
    }

    this.currentAudio = audio;
    this.currentKey = key;

    audio.play().catch(e => console.warn('Audio play failed:', e));
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.currentKey = null;
    }
  }

  playTap() {
    if (this.isMuted || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn('playTap failed', e);
    }
  }
}

export const audioManager = new AudioController();
