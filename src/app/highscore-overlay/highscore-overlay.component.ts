import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-highscore-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './highscore-overlay.component.html',
  styleUrls: ['./highscore-overlay.component.scss']
})
export class HighscoreOverlayComponent {
  @Input() score: number = 0;
  @Output() nameSubmitted = new EventEmitter<string>();

  playerName: string = '';

  /**
  * Emits the player's name if the input is not empty and resets the input field.
  */
  submit() {
    if (this.playerName.trim()) {
      this.nameSubmitted.emit(this.playerName.trim());
      this.playerName = '';
    }
  }
}
