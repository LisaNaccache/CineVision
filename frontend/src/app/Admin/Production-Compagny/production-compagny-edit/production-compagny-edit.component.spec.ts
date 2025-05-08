import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCompagnyEditComponent } from './production-compagny-edit.component';

describe('ProductionCompagnyEditComponent', () => {
  let component: ProductionCompagnyEditComponent;
  let fixture: ComponentFixture<ProductionCompagnyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCompagnyEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCompagnyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
