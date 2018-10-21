import { Component, OnInit, ViewChild } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from './../../common/dock.controls';
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
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  public loading: boolean;
  public dock: Dock;
  public dockControl: DockControl;
  public formGroup: FormGroup;
  public editorOptions: any;
  public recipientList: any;
  public selectedRow: any;
  public userDetails: any;
  @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;
  public ckEditorConfig: any;

  constructor(public _api: SetupService,
    public _userInfo: UserInfoComponent,
    public _fb: FormBuilder) {
    this.dock = new Dock();
    this.setDockControls();
    this.editorOptions = {
      height: 250,
      placeholderText: 'Please Insert Template Text',
      quickInsertTags: [],
      quickInsertButtons: []
    };
    this.ckEditorConfig = buttonconstants.CKEditorSettings;
  }

  ngOnInit() {
    this.formGroup = this._fb.group({
      subject: ['', Validators.required],
      template: ['', Validators.required],
      sendTo: ['', Validators.required]
    });
    this.loading = true;
    Observable.combineLatest(
      this._api.listType(this._userInfo.getCountryId()),
      this._api.messageType(this._userInfo.getCountryId()),
      this._api.fetchUserDetails(this._userInfo.getUserName())
    ).subscribe(data => {
      if (data[0].json().ack == 'success' && data[0].json().Data != 'None') {
        this.simpleDock.dock.dockControls[2].controlOptions = data[0].json().Data;
        this.simpleDock.dock.dockControls[2].idKey = 'messageListId';
        this.simpleDock.dock.dockControls[2].descKey = 'listDescription';
        this.simpleDock.dock.dockControls[2].value = '';
      }
      if (data[1].json().ack == 'success' && data[1].json().Data != 'None') {
        this.simpleDock.dock.dockControls[3].controlOptions = data[1].json().Data;
        this.simpleDock.dock.dockControls[3].idKey = 'lkp_lookup_value_id';
        this.simpleDock.dock.dockControls[3].descKey = 'value_description';
        this.simpleDock.dock.dockControls[3].value = '';
      }
      console.log(data[2].json());
      this.userDetails = data[2].json();
      this.loading = false;
    });
  }
  setDockControls() {
    this.dock.dockControls = [];
    this.dock.backgroundcolor = '#343a40';
    this.addButtonToList('Send', true);
    this.addButtonToList(buttonconstants.Cancel, true);
    this.addSelectToList('List Type');
    this.addSelectToList('Message Type');
  }
  addButtonToList(buttonType: any, enable: boolean) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'button';
    this.dockControl.label = buttonType;
    this.dockControl.enable = enable;
    this.dockControl.value = '';
    this.dock.dockControls.push(this.dockControl);
  }
  addSelectToList(name: string) {
    this.dockControl = new DockControl();
    this.dockControl.type = 'selectSpecified';
    this.dockControl.label = '';
    this.dockControl.enable = true;
    this.dockControl.key = name;
    this.dock.dockControls.push(this.dockControl);
  }
  handleDocEvent(event: any) {
    const eventType = event.eventInfo.toLowerCase();
    console.log(event);
    switch (eventType) {
      case 'send':
        for (const i in this.formGroup.controls) {
          this.formGroup.controls[i].markAsTouched();
        }
        const postData = {
            'memberNotificationId': null,
            'userId': this._userInfo.getUserPreferences().userId,
            'userName': this._userInfo.getUserName(),
            'memberType': null,
            'memberId': this.formGroup.get('sendTo').value,
            'memberMessageTypeId': this.simpleDock.dock.dockControls[3].value,
            'subject': this.formGroup.get('subject').value,
            'message': this.formGroup.get('template').value,
            'emailBody': this.formGroup.get('template').value,
            'memberNotificationStatusId': 129,
            'SentDateTime': this.getCurrentDate(),
            'parentMemberNotificationId': null,
            'foreignKeyId': null,
            'emailSentDate': null
        };
        if (this.formGroup.valid) {
          this.loading = true;
          this._api.sendMessage(postData).subscribe(data => {
            this.loading = false;
            this.formGroup.patchValue({
              sendTo: '',
              template: '',
              subject: ''
            });
            for (const i in this.formGroup.controls) {
              this.formGroup.controls[i].markAsUntouched();
            }
          });
        }
        console.log(postData);
        break;
      case 'cancel':

        break;
      case 'list type':
        break;
      case 'message type':
        if (this.checkifValid(event.value)) {
          this.loading = true;
          this._api.messagesGridSendMessages(this._userInfo.getCountryId(), event.value).subscribe(data => {
            if (data.json().ack == 'success' && data.json().Data != 'None') {
              this.recipientList = data.json();
              this.loading = false;
            }
          },
        data => {
          this.loading = false;
        });
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
  handleTableEvent(event) {
    console.log(event);
    const eventType = event.eventInfo.toLowerCase();
    switch (eventType) {
      case 'rowselected':
        if (event.value[0].ID != undefined) {
          localStorage.setItem('examinerSiteRateEdit', JSON.stringify(event.value[0]));
          this.selectedRow = event.value[0].ID;
          this.formGroup.patchValue({
            sendTo: event.value[0].ID
          });
        } else {
          this.formGroup.patchValue({
            sendTo: ''
          });
        }
        break;
    }
  }
  getCurrentDate() {
    const date = new Date();
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
