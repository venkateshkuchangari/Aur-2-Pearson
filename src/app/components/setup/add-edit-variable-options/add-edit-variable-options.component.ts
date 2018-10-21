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
  selector: 'app-add-edit-variable-options',
  templateUrl: './add-edit-variable-options.component.html',
  styleUrls: ['./add-edit-variable-options.component.css']
})
export class AddEditVariableOptionsComponent implements OnInit {
  public variableId: any;
  public optionsList: any[];
  public formGroup: FormGroup;
  public formArray: FormArray;
  public parentVariableList: any[];
  public dropdownSettings: Object;
  public dropdownList: any[];
  public loading: boolean;
  public dock: Dock;
  public dockControl: DockControl;
  public selectedId: any;
  public newOption: FormGroup;
  public variableName: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(
    public _activateRoute: ActivatedRoute,
    public _api: SetupService,
    public _fb: FormBuilder,
    public _userInfo: UserInfoComponent,
    public _router: Router
  ) {
    this.dropdownSettings = {
      singleSelection: true,
      text: 'Select Parent Variable',
      enableSearchFilter: true,
      lazyLoading: true,
      primaryKey: 'ID',
      labelKey: 'Description',
      maxHeight: 100
    };
    this.loading = false;
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      existingOptions: this._fb.array([])
    });

    this.newOption = this._fb.group({
      'desc': ['', Validators.required],
      'sortOrder': ['', Validators.required],
      'abbr': ['', Validators.required],
      'parentDataColVarOptId': [''],
      'val': ['', Validators.required]
    });

    this._activateRoute.params.subscribe(data => {
      this.variableId = data.id;
      this.variableName = data.variablename;
      this.loading = true;
      Observable.combineLatest(
        this._api.getVariableOptionsGrid(this.variableId),
        this._api.getParentVariableList(this._userInfo.getCountryId())
      ).subscribe(data => {
        console.log(data[0].json());
        if (data[0].json().ack == 'success') {
          this.optionsList = data[0].json().Data;
          if (this.optionsList.length >= 10) {
            this.simpleDock.dock.dockControls[3].enable = false;
          }
          this.formArray = this.formGroup.get('existingOptions') as FormArray;
          for (const i in this.optionsList) {
            this.formArray.push(this.getFormGroup(
              this.optionsList[i].Abbreviation,
              this.optionsList[i].Description,
              this.optionsList[i]['Parent Variable'],
              this.optionsList[i]['Sort Order'],
              this.optionsList[i].Value,
              this.optionsList[i].id,
            ));
          }
        }
        if (data[1].json().ack == 'success') {
          this.dropdownList = data[1].json().Data;
        }
        this.loading = false;
      });
    });
  }
  getFormGroup(abbr, desc, parentVar, sortOrder, val, dataColVarOptId): FormGroup {
    console.log(parentVar);
    const formGorup = this._fb.group({
      abbr: [abbr, Validators.required],
      desc: [desc, Validators.required],
      parentVar: [[]],
      sortOrder: [sortOrder, Validators.required],
      val: [val, Validators.required],
      dataColVarOptId: [dataColVarOptId, Validators.required],
      selected: [false]
    });
    if (parentVar.ID != null) {
      formGorup.patchValue({
        parentVar: [parentVar]
      });
    }
    return formGorup;
  }
  selectedItem(x, y) {
    console.log(x);
    console.log(y);
    this.selectedId = y.get('dataColVarOptId').value;
    const formArray = this.formGroup.get('existingOptions') as FormArray;
    for (const i in formArray.controls) {
      if (y != formArray.controls[i]) {
        formArray.controls[i].patchValue({
          selected: false
        });
      }
    }
  }
  updateRecord(item) {
    console.log(item.value);
    const postData = {
      'dataColVarOptId': item.value.dataColVarOptId,
      'dataCollectionVariableId': this.variableId,
      'dataColVarOptDesc': item.value.desc,
      'sortOrder': item.value.sortOrder,
      'isEditable': 'true',
      'abbreviation': item.value.abbr,
      'parentDataColVarOptId': this.ifDefined(item.value.parentVar) && item.value.parentVar.length != 0 ? item.value.parentVar[0].ID : null,
      'value': item.val

    };
    this.loading = true;
    this._api.updateOptionVariable(postData).subscribe(data => {
      this.loading = false;
    });
  }
  ifDefined(data) {
    if (data != null && data != undefined) {
      return data;
    }
    return null;
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addButtonToList(buttonconstants.Delete, true);
    this.addButtonToList(buttonconstants.AddCalculationMap, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    console.log(eventType);
    switch (eventType) {
      case 'save':
        for (const i in this.newOption.controls) {
          this.newOption.controls[i].markAsTouched();
        }
        if (this.newOption.valid) {
          this.createNewOption();
        }
        break;
      case 'delete':
        console.log(this.selectedId);
        if (this.selectedId) {
          this.loading = true;
          this._api.deleteOptionVariable(this.selectedId).subscribe(data => {
            this.formArray = this.formGroup.get('existingOptions') as FormArray;
            console.log(this.formArray);
            let i: any;
            for (i in this.formArray.controls) {
              if (this.formArray.controls[i].get('dataColVarOptId').value == this.selectedId) {
                (this.formGroup.get('existingOptions') as FormArray).removeAt(i);
                break;
              }
            }
            this.loading = false;
          });
        }
        break;
      case 'cancel':
        this._router.navigate(['home/setup/variablelist']);
        break;
      case 'add calculation map':
        this._router.navigate(['home/setup/variableMapCalculations', this.variableId]);
        break;
    }
  }
  createNewOption() {
    const postData = {
      'dataCollectionVariableId': this.variableId,
      'dataColVarOptDesc': this.newOption.value.desc,
      'sortOrder': this.newOption.value.sortOrder,
      'isEditable': false,
      'abbreviation': this.newOption.value.abbr,
      'parentDataColVarOptId': this.newOption.value.parentDataColVarOptId[0].ID,
      'value': this.newOption.value.val

    };
    this.loading = true;
    this._api.saveOptionVariable(postData).subscribe(data => {
      this._api.getVariableOptionsGrid(this.variableId).subscribe(data => {
        if (data.json().ack == 'success') {


          while ((this.formGroup.get('existingOptions') as FormArray).length != 0) {
            (this.formGroup.get('existingOptions') as FormArray).removeAt(
              (this.formGroup.get('existingOptions') as FormArray).length - 1
            );
          }
          this.optionsList = data.json().Data;
          this.formArray = this.formGroup.get('existingOptions') as FormArray;
          for (const i in this.optionsList) {
            this.formArray.push(this.getFormGroup(
              this.optionsList[i].Abbreviation,
              this.optionsList[i].Description,
              this.optionsList[i]['Parent Variable'],
              this.optionsList[i]['Sort Order'],
              this.optionsList[i].Value,
              this.optionsList[i].dataColVarOptId,
            ));
          }

        }
        this.loading = false;
      });
    });
  }
  castFormGroup() {
    return (this.formGroup.get('existingOptions') as FormGroup).controls;
  }


}
