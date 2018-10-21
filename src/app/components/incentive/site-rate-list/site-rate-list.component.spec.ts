import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteRateListComponent } from './site-rate-list.component';

describe('SiteRateListComponent', () => {
  let component: SiteRateListComponent;
  let fixture: ComponentFixture<SiteRateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteRateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
