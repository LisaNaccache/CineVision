import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFilmAddComponent } from './session-film-add.component';

describe('SessionFilmAddComponent', () => {
  let component: SessionFilmAddComponent;
  let fixture: ComponentFixture<SessionFilmAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFilmAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFilmAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
