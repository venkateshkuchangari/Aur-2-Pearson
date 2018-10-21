import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalTestEmailTemplateComponent } from './digital-test-email-template.component';

describe('DigitalTestEmailTemplateComponent', () => {
  let component: DigitalTestEmailTemplateComponent;
  let fixture: ComponentFixture<DigitalTestEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalTestEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalTestEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
