import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})

export class StartScreenComponent {
  @Output() startGame = new EventEmitter<void>();
  showInstructions = false;

  /**
   * Emits start event to begin the game.
   */
  onStartClick() {
    this.startGame.emit();
  }

  /**
   * Toggles the visibility of the instructions panel.
   */
  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }
}
