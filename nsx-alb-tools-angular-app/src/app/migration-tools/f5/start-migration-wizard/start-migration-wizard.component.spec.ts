import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMigrationWizardComponent } from './start-migration-wizard.component';

describe('StartMigrationWizardComponent', () => {
  let component: StartMigrationWizardComponent;
  let fixture: ComponentFixture<StartMigrationWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartMigrationWizardComponent]
    });
    fixture = TestBed.createComponent(StartMigrationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
