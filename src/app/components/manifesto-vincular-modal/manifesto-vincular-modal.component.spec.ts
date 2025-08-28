import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestoVincularModalComponent } from './manifesto-vincular-modal.component';

describe('ManifestoVincularModalComponent', () => {
  let component: ManifestoVincularModalComponent;
  let fixture: ComponentFixture<ManifestoVincularModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifestoVincularModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestoVincularModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
