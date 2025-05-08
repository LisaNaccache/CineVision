import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreAddComponent } from './genre-add.component';

describe('GenreAddComponent', () => {
  let component: GenreAddComponent;
  let fixture: ComponentFixture<GenreAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
