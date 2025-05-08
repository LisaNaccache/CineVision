import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountryEditComponent } from './production-country-edit.component';

describe('ProductionCountryEditComponent', () => {
  let component: ProductionCountryEditComponent;
  let fixture: ComponentFixture<ProductionCountryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCountryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
