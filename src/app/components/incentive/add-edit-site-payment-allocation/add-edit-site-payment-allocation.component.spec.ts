import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSitePaymentAllocationComponent } from './add-edit-site-payment-allocation.component';

describe('AddEditSitePaymentAllocationComponent', () => {
  let component: AddEditSitePaymentAllocationComponent;
  let fixture: ComponentFixture<AddEditSitePaymentAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSitePaymentAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSitePaymentAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
