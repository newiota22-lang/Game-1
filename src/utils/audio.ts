/**
 * Procedural Web Audio Engine for Petualangan Garuda Pancasila
 * Synthesizes Indonesian pentatonic/pelog-slendro gamelan bell sounds,
 * jumping effects, coin dings, and celebratory fanfares.
 * 100% procedural with zero external 404 dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopBGM();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound effect: Jump (cheerful spring bounce)
   */
  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio context might be restricted
    }
  }

  /**
   * Sound effect: Collect Star / Garuda Point (bright bell chime)
   */
  public playStarCollect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12); // E6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound effect: Correct Moral Decision (Gamelan fanfare triad)
   */
  public playMoralSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Gamelan chime timbre (sine with slight bell ring)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sound effect: Incorrect or Suboptimal Moral Decision (soft empathetic chime)
   */
  public playMoralWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 370]; // descending minor reflection
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.15;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Traditional Indonesian Cheerful Gamelan Slendro Pentatonic BGM Loop
   * Frequencies based on Javanese/Balinese Slendro tuning (scaled to concert pitch: ~C, D, E, G, A)
   */
  public startBGM() {
    if (this.isMuted || this.isMusicPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const slendroNotes = [
      523.25, // Ji (1 / C)
      587.33, // Ro (2 / D)
      659.25, // Lu (3 / E)
      783.99, // Mo (5 / G)
      880.00, // Nem (6 / A)
      1046.50 // Ji alit (1 high / C6)
    ];

    // Cheerful, uplifting rhythm pattern: 1, 2, 3, 5, 3, 2, 6, 1
    const melodyPattern = [0, 1, 2, 3, 2, 1, 4, 3, 1, 2, 4, 5, 4, 2, 3, 0];
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      const freq = slendroNotes[melodyPattern[step % melodyPattern.length]];
      
      // Saron / Bonang tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Bell envelope
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

      // Occasional Kendang / Gong low bass on bar starts (every 8 steps)
      if (step % 8 === 0) {
        const gongOsc = this.ctx.createOscillator();
        const gongGain = this.ctx.createGain();
        gongOsc.type = 'sine';
        gongOsc.frequency.setValueAtTime(130.81, now); // C3
        gongOsc.frequency.exponentialRampToValueAtTime(65.4, now + 0.8);

        gongGain.gain.setValueAtTime(0.08, now);
        gongGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        gongOsc.connect(gongGain);
        gongGain.connect(this.ctx.destination);

        gongOsc.start(now);
        gongOsc.stop(now + 0.9);
      }

      step++;
    }, 280); // ~107 BPM
  }

  public stopBGM() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
