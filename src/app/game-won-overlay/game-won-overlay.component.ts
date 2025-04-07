import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-won-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-won-overlay.component.html',
  styleUrls: ['./game-won-overlay.component.scss']
})
export class GameWonOverlayComponent {
  @Input() score: number = 0;
  @Output() backToMenu = new EventEmitter<void>();

  onBackToMenu() {
    this.backToMenu.emit();
  }
}
