import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
//import { GeneralService } from '../general.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-add-edit-variables',
  templateUrl: './add-edit-variables.component.html',
  styleUrls: ['./add-edit-variables.component.css']
})
export class AddEditVariablesComponent implements OnInit {
  public formGroup: FormGroup;
  public dock: Dock;
  public dockControl: DockControl;
  public details: any;
  public selectedRow: any;
  public loading: boolean;
  public fetchData: any;
  public pageTitle: string;

  constructor(
    public _api: SetupService,
    public _fb: FormBuilder,
    public _router: Router,
    public _dialog: MatDialog,
    public _userInfo: UserInfoComponent) {
    this.pageTitle = 'Create';
    this.loading = false;
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      name: ['', Validators.required],
      desc: ['', Validators.required]
    });
    this.fetchData = localStorage.getItem('variableEdit');
    localStorage.removeItem('variableEdit');
    if (this.fetchData != null) {
      this.pageTitle = 'Edit';
      this.fetchData = JSON.parse(this.fetchData);
      this.loading = true;
      this._api.fetchVariableDetails(this.fetchData.id).subscribe(data => {
        this.loading = false;
        if (data.json().ack == 'success') {
          this.fetchData = data.json().Data[0];
          this.formGroup.patchValue({
            name: this.fetchData.dataCollectionVariableName,
            desc: this.fetchData.dataCollectionVariableDescription
          });
        }
      });
    }

  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addButtonToList(buttonconstants.AddOptions, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    console.log(event);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'save':
        let i: any;
        for (i in this.formGroup.controls) {
          this.formGroup.controls[i].markAsTouched();
        }
        if (this.formGroup.valid) {
          if (this.fetchData != null) {

            const postData = {
              'dataCollectionVariableId': this.fetchData.dataCollectionVariableId,
              'dataCollectionVariableName': this.formGroup.get('name').value,
              'dataCollectionVariableDescription': this.formGroup.get('desc').value,
              'varisEditable': true,
              'countryId': this._userInfo.getCountryId()
            };
            this.loading = true;
            this._api.updateVariable(postData).subscribe(data => {
              this.loading = false;
              this._router.navigate(['home/setup/variablelist']);
            });
          } else {
            const postData = {
              'dataCollectionVariableName': this.formGroup.get('name').value,
              'dataCollectionVariableDescription': this.formGroup.get('desc').value,
              'varisEditable': true,
              'countryId': this._userInfo.getCountryId()
            };
            this.loading = true;
            this._api.saveVariable(postData).subscribe(data => {
              this.loading = false;
              this._router.navigate(['home/setup/variablelist']);
            });
          }
        }
        break;
      case 'cancel':
        this._router.navigate(['home/setup/variablelist']);
        break;
      case 'add options':
        if (this.fetchData) {
          this._router.navigate(['home/setup/addeditVariableOptions', this.fetchData.dataCollectionVariableId, this.fetchData.dataCollectionVariableDescription]);
        }
        break;
      default:
        break;
    }
  }

}
