import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextConversionCardComponent } from './next-conversion-card.component';

describe('NextConversionCardComponent', () => {
  let component: NextConversionCardComponent;
  let fixture: ComponentFixture<NextConversionCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NextConversionCardComponent]
    });
    fixture = TestBed.createComponent(NextConversionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
