import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWonOverlayComponent } from './game-won-overlay.component';

describe('GameWonOverlayComponent', () => {
  let component: GameWonOverlayComponent;
  let fixture: ComponentFixture<GameWonOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameWonOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameWonOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
