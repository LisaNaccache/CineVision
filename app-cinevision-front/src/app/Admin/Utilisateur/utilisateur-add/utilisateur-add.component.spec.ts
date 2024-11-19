import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurAddComponent } from './utilisateur-add.component';

describe('UtilisateurAddComponent', () => {
  let component: UtilisateurAddComponent;
  let fixture: ComponentFixture<UtilisateurAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
