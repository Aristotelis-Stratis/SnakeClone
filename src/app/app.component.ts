import { Component, ViewChild } from '@angular/core';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { SoundService } from './services/sound.service';
import { LeaderboardService } from './services/leaderboard.service';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { HighscoreOverlayComponent } from './highscore-overlay/highscore-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    GameComponent, CommonModule, HighscoreOverlayComponent, LeaderboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameStarted = false;
  showInstructions = false;
  isMuted = false;
  showHighscoreInput = false;
  showLeaderboard = false;

  @ViewChild(GameComponent)
  gameComponent!: GameComponent;

  constructor(
    public gameService: GameService,
    public sound: SoundService,
    public leaderboard: LeaderboardService
  ) {
    this.gameService.newHighscoreEvent.subscribe(() => {
      this.showHighscoreInput = true;
    });
  }

  /**
     * Starts the game and hides all overlays if visible.
     */
  onGameStart() {
    this.closeAllOverlays();
    this.gameStarted = true;
    this.showInstructions = false;
    this.sound.startMusic();
  }

  /**
   * Toggles pause and resume of the game.
   */
  togglePause() {
    if (this.gameService.isPaused) {
      this.gameService.resume(() => this.gameComponent.draw());
      if (this.showLeaderboard) {
        this.showLeaderboard = false;
      }
    } else {
      this.gameService.pause();
    }
  }

  /**
   * Ends the game and returns to main menu.
   */
  onBackToMenu() {
    this.gameStarted = false;
    this.sound.stopMusic();
    this.gameService.reset();
    this.showInstructions = false;
    this.showHighscoreInput = false;
    this.showLeaderboard = false;
  }

  /**
   * Toggles instruction overlay visibility.
   * If the instructions are shown, all other overlays are closed.
   */
  toggleInstructions() {
    if (!this.showInstructions) this.closeAllOverlays();
    this.showInstructions = !this.showInstructions;
  }


  /**
   * Toggles leaderboard overlay visibility.
   * If the leaderboard is shown, the game is paused.
   * If the leaderboard is hidden, the game resumes if it was paused.
   */
  toggleLeaderboard() {
    if (!this.showLeaderboard) {
      this.closeAllOverlays();

      if (this.gameStarted && !this.gameService.isPaused) {
        this.gameService.pause();
      }
    }

    this.showLeaderboard = !this.showLeaderboard;
  }

  /**
 * Handles submission of the player's name after achieving a highscore.
 * Saves the score to the leaderboard and displays the leaderboard overlay.
 * @param name - The name entered by the player.
 */
  onHighscoreNameSubmit(name: string) {
    this.leaderboard.addScore(name, this.gameService.score);
    this.showHighscoreInput = false;
    this.showLeaderboard = true;
  }

  /**
   * Mutes or unmutes all sounds.
   */
  toggleMute() {
    this.sound.toggleMute();
  }

  /**
 * Closes all overlay UIs like instructions, leaderboard and highscore input.
 */
  closeAllOverlays() {
    this.showInstructions = false;
    this.showLeaderboard = false;
    this.showHighscoreInput = false;
  }
}