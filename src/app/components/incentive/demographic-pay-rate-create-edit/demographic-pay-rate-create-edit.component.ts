import { SimpleDockComponent } from './../../common/simple-dock/simple-dock.component';
import { Cancel } from './../../common/app.buttonconstants';
import { Save } from './../../../shared/app.buttonconstants';
import { Dock, DockControl } from './../../common/dock.controls';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';

@Component({
  selector: 'app-demographic-pay-rate-create-edit',
  templateUrl: './demographic-pay-rate-create-edit.component.html',
  styleUrls: ['./demographic-pay-rate-create-edit.component.css']
})
export class DemographicPayRateCreateEditComponent implements OnInit {
  public demoGraphicPayRateForm: FormGroup;
  public variablesForm: FormGroup;
  public variablesList: Variable[] = [];
  public dock: Dock;
  public dockControl: DockControl;
  @Input() create: string;
  @ViewChild(SimpleDockComponent)
  public simpleDock: SimpleDockComponent;

  constructor(public _fb: FormBuilder) {
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.demoGraphicPayRateForm = this._fb.group({
        name: ['', Validators.required],
        test: ['', Validators.required],
        incentiveType: ['', Validators.required],
        payeeType: ['', Validators.required],
        status: ['', Validators.required],
        effectiveDate: ['', Validators.required],
        amount: ['', Validators.required],
        active: [true, Validators.required],
        notes: []
    });
    this.variablesForm = this._fb.group({
        variable: ['', Validators.required],
        values: ['', Validators.required]
    });
    this.variablesList.push({ variable: 'Id', value: '1'});
    this.variablesList.push({ variable: 'Age', value: '3'});
    this.onFormChanges();
  }

  deleteVariable(variable: Variable) {
    this.variablesList.splice(this.variablesList.indexOf(variable), 1);
  }
  addVariable() {
    console.log(this.variablesForm.value);
    this.variablesList.push(this.variablesForm.value);
  }

  onFormChanges() {
    this.demoGraphicPayRateForm.valueChanges.subscribe(val => {
      if (this.demoGraphicPayRateForm.invalid) {
      this.simpleDock.dock.dockControls[0].enable = false;
      }
    });
  }

  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, false);
    this.addButtonToList(buttonconstants.Cancel, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
        case 'save':
            break;
        case 'cancel':
            console.log(event);
            break;
        default:
            break;
    }
  }

}
class Variable {
  variable: String;
  value: String;
}
