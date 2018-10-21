import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitePaymentAllocationListComponent } from './site-payment-allocation-list.component';

describe('SitePaymentAllocationListComponent', () => {
  let component: SitePaymentAllocationListComponent;
  let fixture: ComponentFixture<SitePaymentAllocationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitePaymentAllocationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitePaymentAllocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
