import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VsConfigEditorModalComponent } from './vs-config-editor-modal.component';

describe('VsConfigEditorModalComponent', () => {
  let component: VsConfigEditorModalComponent;
  let fixture: ComponentFixture<VsConfigEditorModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VsConfigEditorModalComponent]
    });
    fixture = TestBed.createComponent(VsConfigEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
