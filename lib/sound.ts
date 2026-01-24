// lib/sound.ts
import { Howl } from 'howler';

type SoundType = 'tap' | 'swipe' | 'decree' | 'levelup' | 'ambient';

class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private ambientSound: Howl | null = null;
  private enabled: boolean = false;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    // UI Sounds
    this.sounds.set('tap', new Howl({
      src: ['/sfx/tap.mp3'],
      volume: 0.3,
      preload: true,
    }));

    this.sounds.set('swipe', new Howl({
      src: ['/sfx/swipe.mp3'],
      volume: 0.2,
      preload: true,
    }));

    this.sounds.set('decree', new Howl({
      src: ['/sfx/decree.mp3'],
      volume: 0.4,
      preload: true,
    }));

    this.sounds.set('levelup', new Howl({
      src: ['/sfx/levelup.mp3'],
      volume: 0.5,
      preload: true,
    }));

    // Mentor-specific ambience
    this.sounds.set('ambient_machiavelli', new Howl({
      src: ['/music/machiavelli_ambience.mp3'],
      volume: 0.15,
      loop: true,
      preload: false,
    }));

    this.sounds.set('ambient_napoleon', new Howl({
      src: ['/music/napoleon_ambience.mp3'],
      volume: 0.15,
      loop: true,
      preload: false,
    }));

    this.sounds.set('ambient_aurelius', new Howl({
      src: ['/music/aurelius_ambience.mp3'],
      volume: 0.15,
      loop: true,
      preload: false,
    }));

    this.sounds.set('ambient_hall', new Howl({
      src: ['/music/hall_ambience.mp3'],
      volume: 0.12,
      loop: true,
      preload: false,
    }));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    }
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  playTap() {
    this.play('tap');
  }

  playSwipe() {
    this.play('swipe');
  }

  playDecree() {
    this.play('decree');
  }

  playLevelUp() {
    this.play('levelup');
  }

  playAmbient(mentorId: string) {
    if (!this.enabled) return;

    // Stop current ambient
    this.stopAmbient();

    // Start new ambient
    const ambientKey = `ambient_${mentorId}`;
    const ambient = this.sounds.get(ambientKey);
    
    if (ambient) {
      ambient.play();
      this.ambientSound = ambient;
    }
  }

  playHallAmbient() {
    this.playAmbient('hall');
  }

  stopAmbient() {
    if (this.ambientSound) {
      this.ambientSound.fade(this.ambientSound.volume(), 0, 500);
      setTimeout(() => {
        this.ambientSound?.stop();
        this.ambientSound = null;
      }, 500);
    }
  }

  fadeOutAmbient(duration: number = 1000) {
    if (this.ambientSound) {
      const currentVolume = this.ambientSound.volume();
      this.ambientSound.fade(currentVolume, 0, duration);
      setTimeout(() => {
        this.ambientSound?.stop();
        this.ambientSound = null;
      }, duration);
    }
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume)));
    }
  }

  setMasterVolume(volume: number) {
    Howler.volume(Math.max(0, Math.min(1, volume)));
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// React Hook for Sound
export function useSound() {
  return {
    playTap: () => soundManager.playTap(),
    playSwipe: () => soundManager.playSwipe(),
    playDecree: () => soundManager.playDecree(),
    playLevelUp: () => soundManager.playLevelUp(),
    playAmbient: (mentorId: string) => soundManager.playAmbient(mentorId),
    stopAmbient: () => soundManager.stopAmbient(),
  };
}