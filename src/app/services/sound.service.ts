import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private sounds: { [key: string]: HTMLAudioElement } = {
    apple: new Audio('assets/sounds/apple_bite.mp3'),
    gameOver: new Audio('assets/sounds/game_over.mp3'),
    gameWon: new Audio('assets/sounds/game_won.mp3'),
    music: new Audio('assets/sounds/game_music.mp3'),
  };

  private muted = false;

  constructor() {
    this.setIndividualVolumes();
    this.sounds['music'].loop = true;
  }

  /**
   * Sets individual volume levels for music and sound effects.
   * Music is set to 10%, sound effects to 40%.
   * Called once during service initialization.
   * @private
   */
  private setIndividualVolumes() {
    this.sounds['music'].volume = 0.1;
    this.sounds['apple'].volume = 0.4;
    this.sounds['gameOver'].volume = 0.4;
    this.sounds['gameWon'].volume = 0.4;
  }

  /**
   * Enables or disables all sounds globally.
   * @param muted - If true, all sounds will be muted.
   */
  setMuted(muted: boolean) {
    this.muted = muted;
    for (const key in this.sounds) {
      this.sounds[key].muted = muted;
    }
  }

  /**
   * Toggles the mute state between on and off.
   */
  toggleMute() {
    this.setMuted(!this.muted);
  }

  /**
   * Returns whether sound is currently muted.
   * @returns True if muted, false otherwise.
   */
  isMuted(): boolean {
    return this.muted;
  }

  /**
   * Plays the apple bite sound effect.
   */
  playAppleBite() {
    this.play('apple');
  }

  /**
   * Plays the game over sound effect.
   */
  playGameOver() {
    this.play('gameOver');
  }

  /**
   * Plays the game won sound effect.
   */
  playGameWon() {
    this.play('gameWon');
  }

  /**
   * Starts background music playback.
   */
  startMusic() {
    this.sounds['music'].play();
  }

  /**
   * Stops the background music and resets playback position.
   */
  stopMusic() {
    this.sounds['music'].pause();
    this.sounds['music'].currentTime = 0;
  }

  /**
   * Plays a sound by its key, resetting playback position.
   * Does nothing if muted.
   * @param key - The key of the sound to play (e.g. 'apple', 'gameOver').
   * @private
   */
  private play(key: string) {
    if (this.muted) return;
    const sound = this.sounds[key];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  }
}
