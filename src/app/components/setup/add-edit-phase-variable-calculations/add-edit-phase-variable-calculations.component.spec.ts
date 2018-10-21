import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPhaseVariableCalculationsComponent } from './add-edit-phase-variable-calculations.component';

describe('AddEditPhaseVariableCalculationsComponent', () => {
  let component: AddEditPhaseVariableCalculationsComponent;
  let fixture: ComponentFixture<AddEditPhaseVariableCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPhaseVariableCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPhaseVariableCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
