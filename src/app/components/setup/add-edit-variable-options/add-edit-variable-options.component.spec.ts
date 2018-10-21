import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVariableOptionsComponent } from './add-edit-variable-options.component';

describe('AddEditVariableOptionsComponent', () => {
  let component: AddEditVariableOptionsComponent;
  let fixture: ComponentFixture<AddEditVariableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditVariableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVariableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
