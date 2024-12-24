import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaAddComponent } from './cinema-add.component';

describe('CinemaAddComponent', () => {
  let component: CinemaAddComponent;
  let fixture: ComponentFixture<CinemaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemaAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CinemaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
