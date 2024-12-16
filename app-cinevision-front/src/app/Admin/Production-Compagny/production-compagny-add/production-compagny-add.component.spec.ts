import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCompagnyAddComponent } from './production-compagny-add.component';

describe('ProductionCompagnyAddComponent', () => {
  let component: ProductionCompagnyAddComponent;
  let fixture: ComponentFixture<ProductionCompagnyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCompagnyAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCompagnyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
