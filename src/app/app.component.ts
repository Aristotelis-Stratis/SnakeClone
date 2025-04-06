import { Component, ViewChild } from '@angular/core';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { SoundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  gameStarted = false;
  showInstructions = false;
  isMuted = false;
  @ViewChild(GameComponent)
  gameComponent!: GameComponent;

  constructor(
    public gameService: GameService,
    public sound: SoundService
  ) { }


  /**
 * Starts the game by showing the game screen, hides the instructions, and starts the music.
 */
  onGameStart() {
    this.gameStarted = true;
    this.showInstructions = false;
    this.sound.startMusic();
  }

  togglePause() {
    if (this.gameService.isPaused) {
      this.gameService.resume(() => this.gameComponent.draw());
    } else {
      this.gameService.pause();
    }
  }

  /**
 * Returns to the main menu from the game.
 */
  onBackToMenu() {
    this.gameStarted = false;
    this.sound.stopMusic();
    this.gameService.reset();
  }

  /**
* Toggles the instruction menu.
*/
  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  /**
* Toggles the game sound on and off.
*/
  toggleMute() {
    this.sound.toggleMute();
  }
}
