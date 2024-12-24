import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCountryListComponent } from './production-country-list.component';

describe('ProductionCountryListComponent', () => {
  let component: ProductionCountryListComponent;
  let fixture: ComponentFixture<ProductionCountryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCountryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCountryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
