import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroExamenEspecialComponent } from './registro-examen-especial.component';

describe('RegistroExamenEspecialComponent', () => {
  let component: RegistroExamenEspecialComponent;
  let fixture: ComponentFixture<RegistroExamenEspecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroExamenEspecialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroExamenEspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
