import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionFilmListComponent } from './session-film-list.component';

describe('SessionFilmListComponent', () => {
  let component: SessionFilmListComponent;
  let fixture: ComponentFixture<SessionFilmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionFilmListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionFilmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
