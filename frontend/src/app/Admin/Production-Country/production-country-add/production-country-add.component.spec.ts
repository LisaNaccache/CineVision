import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountryAddComponent } from './production-country-add.component';

describe('ProductionCountryAddComponent', () => {
  let component: ProductionCountryAddComponent;
  let fixture: ComponentFixture<ProductionCountryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCountryAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
