import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalhesComponent } from './modal-detalhes.component';

describe('ModalDetalhesComponent', () => {
  let component: ModalDetalhesComponent;
  let fixture: ComponentFixture<ModalDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
