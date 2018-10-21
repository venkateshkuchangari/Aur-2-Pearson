import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminerSiteRateComponent } from './examiner-site-rate.component';

describe('ExaminerSiteRateComponent', () => {
  let component: ExaminerSiteRateComponent;
  let fixture: ComponentFixture<ExaminerSiteRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminerSiteRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminerSiteRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
