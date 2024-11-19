import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurEditComponent } from './acteur-edit.component';

describe('ActeurEditComponent', () => {
  let component: ActeurEditComponent;
  let fixture: ComponentFixture<ActeurEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActeurEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActeurEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
