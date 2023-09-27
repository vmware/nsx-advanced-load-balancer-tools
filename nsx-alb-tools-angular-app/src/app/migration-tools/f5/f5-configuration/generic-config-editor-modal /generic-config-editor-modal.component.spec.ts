import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericConfigEditorModalComponent } from './generic-config-editor-modal.component';

describe('GenericConfigEditorModalComponent', () => {
  let component: GenericConfigEditorModalComponent;
  let fixture: ComponentFixture<GenericConfigEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericConfigEditorModalComponent]
    });
    fixture = TestBed.createComponent(GenericConfigEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
