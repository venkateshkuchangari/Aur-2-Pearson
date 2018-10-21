import { SimpleDockComponent } from './../../common/simple-dock/simple-dock.component';
import { Cancel } from './../../common/app.buttonconstants';
import { Save } from './../../../shared/app.buttonconstants';
import { Dock, DockControl } from './../../common/dock.controls';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as buttonconstants from '../../common/app.buttonconstants';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../dialog/dialog/dialog.component';
//import { GeneralService } from '../general.service';
import { SetupService } from '../setup.service';

@Component({
  selector: 'app-variable-list',
  templateUrl: './variable-list.component.html',
  styleUrls: ['./variable-list.component.css']
})
export class VariableListComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public details: any;
  public selectedRow: any;
  public loading: boolean;
  public newlyCreatedPhaseId: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

  constructor(
    public _api: SetupService,
    public _router: Router,
    public _dialog: MatDialog,
    public _userInfo: UserInfoComponent) {
    this.dock = new Dock();
    this.loading = false;
    this.dock = new Dock();
    this.setDockControls();
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(this._api.gridApiForVariables(this._userInfo.getCountryId())).subscribe(data => {
      if (data[0].json().ack == 'success') {
        this.details = data[0].json();
      }
      console.log(this.details);
      this.loading = false;
    });
  }

  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList(buttonconstants.Add, true);
    this.addButtonToList(buttonconstants.Edit, true);
    this.addButtonToList(buttonconstants.Delete, true);
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
      case 'add':
        this._router.navigate(['/home/setup/addEditVariables']);
        break;
      case 'edit':
        if (this.selectedRow != null) {
          localStorage.setItem('variableEdit', JSON.stringify(this.selectedRow));
          this._router.navigate(['/home/setup/addEditVariables']);
        }
        break;
      case 'delete':
        if (this.selectedRow != null && this.selectedRow != undefined) {
          const dialogRef = this._dialog.open(DialogComponent, {
            width: '350px',
            data: {
              item: 'Variable',
              id: this.selectedRow.id
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'yes') {
              this.loading = true;
              this._api.deleteVariable(this.selectedRow.id).subscribe(result => {
                this._api.gridApiForVariables(this._userInfo.getCountryId()).subscribe(data => {
                  this.details = data.json();
                  this.loading = false;
                });
              });
            }
          });
        }
        break;
      default:
        break;
    }
  }
  handleTableEvent(event) {
    console.log(event);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'rowselected':
        if (event.value[0].id != undefined) {
          localStorage.setItem('examinerSiteRateEdit', JSON.stringify(event.value[0]));
          this.selectedRow = event.value[0];
        } else {
          this.selectedRow = null;
        }
        break;
    }
  }
}
