import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabControllerCardComponent } from './lab-controller-card.component';

describe('LabControllerCardComponent', () => {
  let component: LabControllerCardComponent;
  let fixture: ComponentFixture<LabControllerCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabControllerCardComponent]
    });
    fixture = TestBed.createComponent(LabControllerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
