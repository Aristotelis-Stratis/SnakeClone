import { Component } from '@angular/core';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { GameComponent } from './game/game.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StartScreenComponent, GameComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  gameStarted = false;

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
}
