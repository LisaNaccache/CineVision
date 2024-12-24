import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCompagnyListComponent } from './production-compagny-list.component';

describe('ProductionCompagnyListComponent', () => {
  let component: ProductionCompagnyListComponent;
  let fixture: ComponentFixture<ProductionCompagnyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCompagnyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCompagnyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
