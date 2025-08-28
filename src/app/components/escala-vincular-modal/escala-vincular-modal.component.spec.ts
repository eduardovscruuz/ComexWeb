import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalaVincularModalComponent } from './escala-vincular-modal.component';

describe('EscalaVincularModalComponent', () => {
  let component: EscalaVincularModalComponent;
  let fixture: ComponentFixture<EscalaVincularModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalaVincularModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscalaVincularModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
