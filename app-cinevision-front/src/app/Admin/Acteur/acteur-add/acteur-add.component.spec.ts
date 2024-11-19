import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurAddComponent } from './acteur-add.component';

describe('ActeurAddComponent', () => {
  let component: ActeurAddComponent;
  let fixture: ComponentFixture<ActeurAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActeurAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActeurAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
