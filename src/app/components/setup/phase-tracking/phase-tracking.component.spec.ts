import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseTrackingComponent } from './phase-tracking.component';

describe('PhaseTrackingComponent', () => {
  let component: PhaseTrackingComponent;
  let fixture: ComponentFixture<PhaseTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
