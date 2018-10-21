import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTrackingComponent } from './add-edit-tracking.component';

describe('AddEditTrackingComponent', () => {
  let component: AddEditTrackingComponent;
  let fixture: ComponentFixture<AddEditTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
