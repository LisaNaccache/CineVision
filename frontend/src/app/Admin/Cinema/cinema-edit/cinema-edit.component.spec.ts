import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaEditComponent } from './cinema-edit.component';

describe('CinemaEditComponent', () => {
  let component: CinemaEditComponent;
  let fixture: ComponentFixture<CinemaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemaEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CinemaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
