import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableMapCalculationsComponent } from './variable-map-calculations.component';

describe('VariableMapCalculationsComponent', () => {
  let component: VariableMapCalculationsComponent;
  let fixture: ComponentFixture<VariableMapCalculationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableMapCalculationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableMapCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
