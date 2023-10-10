import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLabControllerModalComponent } from './edit-lab-controller-modal.component';

describe('EditLabControllerModalComponent', () => {
  let component: EditLabControllerModalComponent;
  let fixture: ComponentFixture<EditLabControllerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLabControllerModalComponent]
    });
    fixture = TestBed.createComponent(EditLabControllerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
