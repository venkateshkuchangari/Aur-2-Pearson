import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentFormEmailTemplateComponent } from './consent-form-email-template.component';

describe('ConsentFormEmailTemplateComponent', () => {
  let component: ConsentFormEmailTemplateComponent;
  let fixture: ComponentFixture<ConsentFormEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentFormEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentFormEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
