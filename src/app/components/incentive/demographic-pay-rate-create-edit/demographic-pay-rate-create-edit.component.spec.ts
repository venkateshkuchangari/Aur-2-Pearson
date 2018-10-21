import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicPayRateCreateEditComponent } from './demographic-pay-rate-create-edit.component';

describe('DemographicPayRateCreateEditComponent', () => {
  let component: DemographicPayRateCreateEditComponent;
  let fixture: ComponentFixture<DemographicPayRateCreateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemographicPayRateCreateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographicPayRateCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
