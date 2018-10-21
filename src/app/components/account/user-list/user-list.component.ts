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
// import { SettingService } from '../settings.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  public dock: Dock;
  public dockControl: DockControl;
  public details: any;
  public selectedRow: any;
  public loading: boolean;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;
  constructor(public _setupService: AccountService, public _router: Router, public dialog: MatDialog) {
    this.dock = new Dock();
    this.setDockControls();
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    Observable.combineLatest(this._setupService.fetchUserList()).subscribe(data => {
      this.details = data[0].json();
      this.loading = false;
    });
  }

  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = "#343a40"
    this.addButtonToList(buttonconstants.AddorEdit, true);
    this.addButtonToList(buttonconstants.Refresh, true);
  }

  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = "button";
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dock.dockControls.push(this.dockControl);
  }

  handleDocEvent(event: any) {
    console.log(event);
    let eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'add':
        console.log(eventType);
        this._router.navigate(['/home/account/addEditUser']);
        break;
      case "edit":
        console.log(this.selectedRow);
        if (this.selectedRow != null) {
          localStorage.setItem("editUser", JSON.stringify(this.selectedRow));
          this._router.navigate(['/home/account/addEditUser']);
        }
        break;
      case "add/edit":
      console.log(event);
      /* console.log(this.selectedRow); */
        if (this.selectedRow != null) {
          localStorage.setItem("editUser", JSON.stringify(this.selectedRow));
          this._router.navigate(['/home/account/addEditUser']);
        } else {
          this._router.navigate(['/home/account/addEditUser']);
        }
        break;
      case "delete":
        if (this.selectedRow != null && this.selectedRow != undefined) {
          let dialogRef = this.dialog.open(DialogComponent, {
            width: '250px',
            data: {
              item: 'Examiner Site Rate',
              id: this.selectedRow.id
            }
          });
          this.loading = true;
          dialogRef.afterClosed().subscribe(result => {
            if (result == 'yes') {
              this._setupService.deleteUser(this.selectedRow.id).subscribe(result => {
                this.loading = false;
                console.log("success" + result);
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
    let eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case "rowselected":
        if (event.value[0].userName != undefined) {
          localStorage.setItem("examinerSiteRateEdit", JSON.stringify(event.value[0]));
          this.selectedRow = event.value[0];
        }
        else {
          this.selectedRow = null;
        }
        break;
    }
  }
}