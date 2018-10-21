import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseStatusManagementComponent } from './phase-status-management.component';

describe('PhaseStatusManagementComponent', () => {
  let component: PhaseStatusManagementComponent;
  let fixture: ComponentFixture<PhaseStatusManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseStatusManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseStatusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
