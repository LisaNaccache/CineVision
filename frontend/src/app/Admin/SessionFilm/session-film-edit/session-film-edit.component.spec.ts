import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFilmEditComponent } from './session-film-edit.component';

describe('SessionFilmEditComponent', () => {
  let component: SessionFilmEditComponent;
  let fixture: ComponentFixture<SessionFilmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFilmEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFilmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
