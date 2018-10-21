import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToPhaseComponent } from './add-member-to-phase.component';

describe('MembersPhaseTrackingComponent', () => {
  let component: AddMemberToPhaseComponent;
  let fixture: ComponentFixture<AddMemberToPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberToPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberToPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
