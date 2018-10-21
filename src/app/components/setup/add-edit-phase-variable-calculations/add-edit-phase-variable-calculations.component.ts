import { ActivatedRoute } from '@angular/router';
//import { GeneralService } from '../general.service';
import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-add-edit-phase-variable-calculations',
  templateUrl: './add-edit-phase-variable-calculations.component.html',
  styleUrls: ['./add-edit-phase-variable-calculations.component.css']
})
export class AddEditPhaseVariableCalculationsComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public loading: boolean;
  public project: any;
  public phase: any;
  public variable: any;
  public details: any[];
  public formGroup: FormGroup;
  public mappedDropdownList: any[];
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(
    public _api: SetupService,
    public _userInfo: UserInfoComponent,
    public _route: Router,
    public _fb: FormBuilder
  ) {
    this.dock = new Dock();
    this.loading = false;
    this.setDockControls();
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      list: this._fb.array([])
    });
    this.loading = true;
    Observable.combineLatest(
      this._api.projectList(this._userInfo.getCountryId()),
      this._api.getVariables(this._userInfo.getCountryId())
    ).subscribe(data => {
      console.log(data[0].json());
      if (data[0].json().ack == 'success' && data[0].json().Data != 'None') {
        this.simpleDock.dock.dockControls[2].controlOptions = data[0].json().Data;
        this.simpleDock.dock.dockControls[2].idKey = 'project_id';
        this.simpleDock.dock.dockControls[2].descKey = 'project_name';
      }
      if (data[1].json().ack == 'success') {
        console.log(data[1].json());
        this.simpleDock.dock.dockControls[4].controlOptions = data[1].json().Data;
        this.simpleDock.dock.dockControls[4].idKey = 'lkp_lookup_value_id';
        this.simpleDock.dock.dockControls[4].descKey = 'value_description';
      }
      this.loading = false;
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addSelectToList(buttonconstants.Project);
    this.addSelectToList(buttonconstants.Phase);
    this.addSelectToList(buttonconstants.Variable);
    this.addButtonToList(buttonconstants.AddVariable, true);
    this.addButtonToList(buttonconstants.AddVariableCalculationMap, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(controlName: string) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'selectSpecified';
    this.dockControl.label = '';
    this.dockControl.enable = true;
    this.dockControl.key = controlName;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo;
    console.log(eventType);
    switch (eventType) {
      case buttonconstants.Save:
        this.markFormGroupTouched(this.formGroup);
        if (this.formGroup.valid) {
          const saveItemArray: saveItem[] = [];
          for (const i in (this.formGroup.get('list') as FormArray).controls) {
            const saveObj: saveItem = {
              dataColVarXref: (this.formGroup.get('list') as FormArray).controls[i].get('option').value,
              mappedDataColVarOptId: (this.formGroup.get('list') as FormArray).controls[i].get('mappedOption').value,
              dataColVarXrefCnt: (this.formGroup.get('list') as FormArray).controls[i].get('count').value,
              dataColVarId: this.simpleDock.dock.dockControls[4].value,
              phaseId: this.simpleDock.dock.dockControls[3].value
            };
            saveItemArray.push(saveObj);

          }
          const postData = {
            frPhaseDataColVarOptCalcDTOSet: saveItemArray
          };
          this.loading = true;
          this._api.phaseVariableCalculationsave(postData).subscribe(data => {
            this.loading = false;
          });
          console.log(postData);
        }
        break;
      case buttonconstants.Cancel:
        this._route.navigate(['home/setup/variablelist']);
        break;
      case buttonconstants.Project:
        if (this.checkifValid(event.value)) {
          this.loading = true;
          this._api.getPhaseList(event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.simpleDock.dock.dockControls[3].controlOptions = data.json().Data;
              this.simpleDock.dock.dockControls[3].idKey = 'phase_id';
              this.simpleDock.dock.dockControls[3].descKey = 'phase_name';
            } else {
              this.simpleDock.dock.dockControls[3].controlOptions = [];
              this.simpleDock.dock.dockControls[3].idKey = 'phase_id';
              this.simpleDock.dock.dockControls[3].descKey = 'phase_name';
            }
            this.loading = false;
          });
        }
        break;
      case buttonconstants.Phase:
        break;
      case buttonconstants.Variable:
        const phaseId = this.simpleDock.dock.dockControls[3].value;
        const variableId = event.value;
        if (this.checkifValid(phaseId) && this.checkifValid(variableId)) {
          this.loading = true;
          Observable.combineLatest(
            this._api.getList(phaseId, variableId),
            this._api.mappedOptionDropdown(variableId)
          ).subscribe(data => {
            if (data[0].json().ack == 'success' && data[0].json().Data != 'None' && data[0].json().Data != '') {
              this.details = data[0].json().Data;
              for (const i in this.details) {
                const formGroup = this.getFormGroup(
                  this.details[i].id,
                  this.details[i].Options,
                  this.details[i]['Mapped Option'],
                  this.details[i]['Option Count']
                );
                (this.formGroup.get('list') as FormArray).push(formGroup);
              }
              this.loading = false;
              console.log(data[1].json());
              if (data[1].json().ack == 'success' && data[1].json().Data != 'None' && data[1].json().Data != '') {
                this.mappedDropdownList = data[1].json().Data;
              }

            }
          });

        }
        break;
      case buttonconstants.AddVariable:
        this._route.navigate(['home/setup/addEditVariables']);
        break;
      case buttonconstants.AddVariableCalculationMap:
        const phaseIdForCalculationMap = this.dock.dockControls[3].value;
        if (this.checkifValid(phaseIdForCalculationMap)) {
          this._route.navigate(['home/setup/variableMapCalculations', this.dock.dockControls[3].value]);
        }
        break;
    }
  }
  checkifValid(data) {
    if (data != null && data != undefined && data != '') {
      return true;
    }
    return false;
  }

  getFormGroup(id, option, mappedOption, count) {
    const formGroup = this._fb.group({
      selected: [false],
      id: [id],
      option: [{ value: option, disabled: true }],
      mappedOption: [mappedOption.ID, Validators.required],
      count: [{ value: count, disabled: true }]
    });
    if (!mappedOption.ID) {
      formGroup.patchValue({
        mappedOption: []
      });
    }
    return formGroup;
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }
  formGroupCast() {
    return (this.formGroup.get('list') as FormGroup).controls;
  }

}
interface saveItem {
  dataColVarXref: string;
  mappedDataColVarOptId: string;
  dataColVarXrefCnt: string;
  dataColVarId: string;
  phaseId: string;

}
