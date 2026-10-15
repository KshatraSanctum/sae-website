// ==========================================================================
// TRACK AUDIO SYNTHESIZER (Web Audio API)
// Provides zero-latency procedural motorsport sound effects:
// - Engine rumble & pitch modulation based on car speed
// - Tire drift screech
// - Checkpoint sector chime
// - Off-track crash impact thump
// - Clean lap checkered flag victory fanfare
// ==========================================================================

export class TrackAudio {
  private ctx: AudioContext | null = null;
  private muted = false;

  // Engine sound nodes
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private isEngineRunning = false;

  // Screech sound nodes
  private screechNoise: AudioBufferSourceNode | null = null;
  private screechGain: GainNode | null = null;
  private isScreeching = false;

  constructor() {
    const saved = localStorage.getItem('sae_track_muted');
    if (saved === 'true') {
      this.muted = true;
    }
  }

  private initContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        return this.ctx;
      }
    } catch (_) {
      // Audio not supported
    }
    return null;
  }

  public get isAudioMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('sae_track_muted', this.muted ? 'true' : 'false');

    if (this.muted) {
      this.stopEngine();
      this.stopScreech();
    } else {
      this.initContext();
      this.startEngine();
    }
    return this.muted;
  }

  public startEngine(): void {
    if (this.muted || this.isEngineRunning) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.engineOsc = ctx.createOscillator();
      this.engineGain = ctx.createGain();
      this.engineFilter = ctx.createBiquadFilter();

      // Sawtooth wave for authentic combustion engine harmonics
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(45, ctx.currentTime);

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(280, ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.08, ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(ctx.destination);

      this.engineOsc.start();
      this.isEngineRunning = true;
    } catch (_) {
      // Ignore audio start failures before gesture
    }
  }

  public updateEnginePitch(speed: number): void {
    if (this.muted || !this.isEngineRunning || !this.engineOsc || !this.ctx || !this.engineFilter) return;

    // Pitch scales from 50Hz idle to 240Hz redline
    const targetFreq = 50 + Math.min(speed * 18, 190);
    const targetFilter = 260 + Math.min(speed * 60, 900);

    const t = this.ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, t, 0.05);
    this.engineFilter.frequency.setTargetAtTime(targetFilter, t, 0.05);
  }

  public stopEngine(): void {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
        this.engineOsc = null;
      }
      this.isEngineRunning = false;
    } catch (_) {}
  }

  public startScreech(): void {
    if (this.muted || this.isScreeching) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      this.screechNoise = ctx.createBufferSource();
      this.screechNoise.buffer = buffer;
      this.screechNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      this.screechGain = ctx.createGain();
      this.screechGain.gain.setValueAtTime(0.12, ctx.currentTime);

      this.screechNoise.connect(filter);
      filter.connect(this.screechGain);
      this.screechGain.connect(ctx.destination);

      this.screechNoise.start();
      this.isScreeching = true;
    } catch (_) {}
  }

  public stopScreech(): void {
    if (!this.isScreeching) return;
    try {
      if (this.screechNoise) {
        this.screechNoise.stop();
        this.screechNoise.disconnect();
        this.screechNoise = null;
      }
      this.isScreeching = false;
    } catch (_) {}
  }

  public playCheckpoint(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.setValueAtTime(880.0, t + 0.08); // A5

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch (_) {}
  }

  public playCrash(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // Low sub-bass thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.42);
    } catch (_) {}
  }

  public playLapComplete(): void {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      // 3-note celebration fanfare (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = ctx.currentTime + idx * 0.11;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch (_) {}
  }

  public destroy(): void {
    this.stopEngine();
    this.stopScreech();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (_) {}
      this.ctx = null;
    }
  }
}
