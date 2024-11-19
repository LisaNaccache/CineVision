import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActeurListComponent } from './acteur-list.component';

describe('ActeurListComponent', () => {
  let component: ActeurListComponent;
  let fixture: ComponentFixture<ActeurListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActeurListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActeurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
