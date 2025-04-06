import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreOverlayComponent } from './highscore-overlay.component';

describe('HighscoreOverlayComponent', () => {
  let component: HighscoreOverlayComponent;
  let fixture: ComponentFixture<HighscoreOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighscoreOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighscoreOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
