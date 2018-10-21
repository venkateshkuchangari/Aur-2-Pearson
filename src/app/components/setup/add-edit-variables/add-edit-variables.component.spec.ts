import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVariablesComponent } from './add-edit-variables.component';

describe('AddEditVariablesComponent', () => {
  let component: AddEditVariablesComponent;
  let fixture: ComponentFixture<AddEditVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
