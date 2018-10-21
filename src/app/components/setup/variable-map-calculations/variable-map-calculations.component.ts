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
import * as Combinatorics from '../../../../../node_modules/js-combinatorics/combinatorics.js';
import { SetupService } from '../setup.service';
@Component({
  selector: 'app-variable-map-calculations',
  templateUrl: './variable-map-calculations.component.html',
  styleUrls: ['./variable-map-calculations.component.css']
})
export class VariableMapCalculationsComponent implements OnInit {
  private variableId: any;
  public dock: Dock;
  public dockControl: DockControl;
  public loading: boolean;
  public formGroup: FormGroup;
  public optionId: any;
  public generatedOptions: any[];
  public mappedOptionList: any[];
  public fetchData: any[];
  public dropdownSettings: any;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _api: SetupService,
    public _dialog: MatDialog,
    public _fb: FormBuilder,
    public _router: Router
  ) {
    this.dock = new Dock();
    this.setDockControls();
    this.dropdownSettings = {
      singleSelection: true,
        text: 'Select Mapped Option',
        enableSearchFilter: true,
        lazyLoading: true,
        primaryKey: 'lkp_lookup_value_id',
        labelKey: 'value_description',
        maxHeight: 100
    };
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      list: this._fb.array([])
    });
    this._activatedRoute.params.subscribe(data => {
      this.variableId = data.id;
      this.loading = true;
      Observable.combineLatest(
        this._api.fetchListVariableMapCaliculations(this.variableId),
        this._api.getVariableOptionsGrid(this.variableId),
        this._api.mappedOptionDropdown(this.variableId)
      ).subscribe(data => {
        console.log(data[0].json());
        if (data[0].json().ack == 'success' && data[0].json().Data != 'None' && data[0].json().Data != '') {
          this.fetchData = data[0].json().data;
          for (const i in data[0].json().Data) {
            (this.formGroup.get('list') as FormArray).push(
              this.getFormGroup(
                data[0].json().Data[i].id,
                data[0].json().Data[i].Options,
                data[0].json().Data[i]['Mapped Option'],
                data[0].json().Data[i]['Option Count'],
              )
            );
          }
        } else {
          const options = [];
          for (const i in data[1].json().Data) {
            options.push(data[1].json().Data[i].Abbreviation);
          }
          const array = [];
          Combinatorics.power(options).forEach(function (a) { if (a.length != 0) { array.push(a); } });
          console.log(array);

          for (const i in array) {
            (this.formGroup.get('list') as FormArray).push(
              this.getFormGroup(
                '',
                array[i],
                '',
                array[i].length
              )
            );
          }

        }
        console.log(data[1].json());
        console.log(data[2].json());
        if (data[2].json().ack == 'success' && data[2].json().Data != 'None') {
          this.mappedOptionList = data[2].json().Data;
        }
        this.loading = false;
      });
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Save, true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addButtonToList(buttonconstants.ResetCalculationMap, true);
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
        this.markFormGroupTouched(this.formGroup);
        if (this.formGroup.valid) {
          console.log('valid Group');
          const frDataColVarOptCalcDTOSet: savedatacolvaroptcalc[] = [];
          for (const i in (this.formGroup.get('list') as FormArray).controls) {
            const item: savedatacolvaroptcalc = {dataColVarXref: '', mappedDataColVarOptId: '', dataColVarXrefCnt: '', dataColVarId: ''};
            const type = typeof (this.formGroup.get('list') as FormArray).controls[i].get('option').value;
            if (type == 'object') {
            item.dataColVarXref = (this.formGroup.get('list') as FormArray).controls[i].get('option').value.join();
            } else {
            item.dataColVarXref = (this.formGroup.get('list') as FormArray).controls[i].get('option').value;
            }
            console.log((this.formGroup.get('list') as FormArray).controls[i].get('mappedOption').value);
            item.mappedDataColVarOptId = (this.formGroup.get('list') as FormArray).controls[i].get('mappedOption').value[0][this.dropdownSettings.primaryKey];
            item.dataColVarXrefCnt = (this.formGroup.get('list') as FormArray).controls[i].get('count').value;
            item.dataColVarId = this.variableId;
            frDataColVarOptCalcDTOSet.push(item);
          }
          const postData = {
            frDataColVarOptCalcDTOSet: frDataColVarOptCalcDTOSet
          };
          this.loading = true;
          this._api.savedatacolvaroptcalc(postData).subscribe(data => {
            this.loading = false;
          });
          console.log(postData);
        }
        break;
      case 'cancel':
      this._router.navigate(['home/setup/variablelist']);
        break;
      case 'reset calculation map':
        const dialogRef = this._dialog.open(DialogComponent, {
          width: '250px',
          data: {
            item: 'Delete option',
            id: this.variableId
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'yes') {
            this.loading = true;
            this._api.deleteVariableMap(this.variableId).subscribe(result => {
              this.loading = false;
              this._router.navigate(['home/setup/variableList']);
              console.log('success' + result);
            });
          }
        });
        break;
    }
  }
  getFormGroup(id, option, mappedOption, count) {
    const formGroup = this._fb.group({
      selected: [false],
      id: [id],
      option: [{ value: option, disabled: true }],
      mappedOption: [[{lkp_lookup_value_id: mappedOption.ID, value_description: mappedOption.Description}], Validators.required],
      count: [{ value: count, disabled: true }]
    });
    if (!mappedOption.ID) {
      formGroup.patchValue({
        mappedOption: []
      });
    }
    return formGroup;
  }
  selectedItem(x, y) {

    console.log(y);
    console.log(y.value.selected);
    this.optionId = y.get('id').value;
    console.log('selected item' + this.optionId);
    const formArray = this.formGroup.get('list') as FormArray;
    for (const i in formArray.controls) {
      if (y != formArray.controls[i]) {
        formArray.controls[i].patchValue({
          selected: false
        });
      }
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }
  formGroupcast() {
    return (this.formGroup.get('list') as FormGroup).controls;
  }


}
export interface savedatacolvaroptcalc {
  dataColVarXref: string;
  mappedDataColVarOptId: string;
  dataColVarXrefCnt: string;
  dataColVarId: string;
}



