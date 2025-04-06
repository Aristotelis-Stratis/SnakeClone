import { Injectable } from '@angular/core';

export interface ScoreEntry {
  name: string;
  score: number;
}

const STORAGE_KEY = 'snake-leaderboard';
const MAX_ENTRIES = 5;

@Injectable({ providedIn: 'root' })

export class LeaderboardService {
  /**
   * Returns the top scores from localStorage.
   */
  getScores(): ScoreEntry[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Adds a score to the leaderboard.
   * @param name Player name
   * @param score Score value
   */
  addScore(name: string, score: number): void {
    const scores = this.getScores();

    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);

    const trimmed = scores.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  /**
   * Checks whether a score would qualify as a highscore (top 5).
   * @param score Score value
   * @returns True if this score qualifies as a highscore
   */
  isHighscore(score: number): boolean {
    const scores = this.getScores();
    if (scores.length < MAX_ENTRIES) return true;

    const lowestHighscore = scores[scores.length - 1].score;
    return score > lowestHighscore;
  }
}
