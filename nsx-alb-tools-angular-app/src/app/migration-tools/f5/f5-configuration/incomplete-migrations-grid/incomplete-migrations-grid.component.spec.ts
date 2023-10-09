import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteMigrationsGridComponent } from './incomplete-migrations-grid.component';

describe('IncompleteMigrationsGridComponent', () => {
  let component: IncompleteMigrationsGridComponent;
  let fixture: ComponentFixture<IncompleteMigrationsGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncompleteMigrationsGridComponent]
    });
    fixture = TestBed.createComponent(IncompleteMigrationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
