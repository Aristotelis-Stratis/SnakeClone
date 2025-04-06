import { Component } from '@angular/core';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';

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

  constructor(public gameService: GameService) {}
  /**
 * Starts the game by showing the game screen.
 */
  onGameStart() {
    this.gameStarted = true;
  }

  /**
 * Returns to the main menu from the game.
 */
  onBackToMenu() {
    this.gameStarted = false;
  }

  /**
* Toggles the instruction menu.
*/
  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // optional: mute logic (z. B. SoundService)
  }
}
