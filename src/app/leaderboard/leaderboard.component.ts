import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreEntry } from '../services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {

  /**
 * Array of score entries to display in the leaderboard.
 */
  @Input() scores: ScoreEntry[] = [];

  /**
 * Emits an event when the leaderboard overlay should be closed.
 */
  @Output() close = new EventEmitter<void>();
}
