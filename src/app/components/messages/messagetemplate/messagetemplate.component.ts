import { Component, ViewChild } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as buttonconstants from '../../common/app.buttonconstants';
import { Observable } from 'rxjs';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { ErrorComponent } from '../../../services/error.component';
import { ApiCallComponent } from '../../../services/apicall.component';
import { MessageComponent } from '../../common/error-message.component';
import { MessageCenter } from './message-center.model';
//import { CKEditorModule } from 'ng2-ckeditor';

declare var $: any;
@Component({
    selector: 'messagetemplate',
    templateUrl: 'messagetemplate.component.html',
    styleUrls: ['messagetemplate.component.scss']
})
export class MessagetemplateComponent {
    public dock: Dock;
    public dockControl: DockControl;
    public formGroup: FormGroup;
    public editorOptions: Object;
    public loading: boolean;
    public fetchData: any;
    isRowSelected: boolean;
    selectedData: any[];
    countryId: any;
    headerSelected: boolean;
    details: any;
    id: number;
    isComponentloaded: boolean;
    userId: string;
    dloList: KeyValuePair[];
    messageCenter: MessageCenter;
    public ckEditorConfig: any;

    @ViewChild(SimpleDockComponent) simpleDock: SimpleDockComponent;

    constructor(private datePipe: DatePipe, private apicall: ApiCallComponent
        , private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private errorComponent: ErrorComponent) {
        this.dock = new Dock();
        this.dockControl = new DockControl();
        this.setDockControls();
        this.loading = false;
        this.id = 0;
        this.isComponentloaded = false;
        this.messageCenter = new MessageCenter();
        this.editorOptions = {
            height: 250,
            placeholderText: 'Please Insert Template Text',
            quickInsertTags: [],
            quickInsertButtons: []
        };
        this.ckEditorConfig = buttonconstants.CKEditorSettings;
    }

    ngOnInit() {
        this.userId = this.userInfo.getUserId();
        this.messageCenter.userId = this.userId;
        this.messageCenter.userName = this.userInfo.getUserName();

        this.getTemplateDataForUnRead();

        this.countryId = this.userInfo.getCountryId();

        this.formGroup = new FormGroup({
            template: new FormControl('', [Validators.required]),

        });

        this.getDloList();
    }



    getDloList() {
        this.dloList = [];
        Observable.forkJoin(
            this.getPageDDLs('126/' + this.countryId).map((data: any) => {
               // if (data[0].json().ack == "success") {
                    let i = 0;
                    for (i = 0; i < data.length; i++) {
                        const info = new KeyValuePair();
                        info.ID = data[i].lkp_lookup_value_id;
                        info.Description = data[i].value_description;
                        this.dloList.push(info);
                    }
               // }


            }),

        ).subscribe(
            data => {
                this.setDockControls();
            },
            err => {
            });
    }

    getPageDDLs(param: any): Observable<any> {
        return this.apicall.get(ApiEndpoints.getdetails, param).map(
            res => {
                if (res.json().ack == 'success' && res.json().Data != 'None') {
                    return res.json().Data;
                } else {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                    return [];
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

    saveTemplateData() {
        this.messageCenter.emailBody = this.formGroup.get('template').value;
        if (this.messageCenter.memberNotificationId  != null && this.messageCenter.memberNotificationId > 0) {
            this.apicall.post(ApiEndpoints.updatemessage,  this.messageCenter).subscribe(
                res => {
                    if (res.status == '201') {
                        this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                            duration: 2000,
                        });
                        this.cancelEvent();
                        this.setDockControls();
                    } else {
                        this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                        // this.errorComponent.handleError(err);
                    }
                });

        } else {
        this.apicall.post(ApiEndpoints.savemessage,  this.messageCenter).subscribe(
            res => {
                if (res.status == '201') {
                    this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                        duration: 2000,
                    });
                    this.cancelEvent();
                    this.setDockControls();
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                    // this.errorComponent.handleError(err);
                }
            });
        }
    }

    getTemplateDataForUnRead() {

          this.loading = true;

        this.apicall.get(ApiEndpoints.getdetails, '127/' + this.userId).subscribe(
            res => {
                this.loading = false;
                if (res.json().ack == 'success') {
                    this.details = res.json();
                } else {


                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                    // this.errorComponent.handleError(err);
                }

            },
            err => {
                this.loading = false;

                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });

    }


    getTemplateDataForRead() {

        //  this.loader.loading = true;

        this.apicall.get(ApiEndpoints.getdetails, '129/' + this.userId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.details = res.json();
                } else {

                    // this.loader.loading = false;
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                    // this.errorComponent.handleError(err);
                }

            },
            err => {
                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });

    }

    getTemplateDataForSentMsgs() {

        //  this.loader.loading = true;

        this.apicall.get(ApiEndpoints.getdetails, '128/' + this.userId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.details = res.json();
                } else {

                    // this.loader.loading = false;
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                    // this.errorComponent.handleError(err);
                }

            },
            err => {
                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });

    }

    handleTableEvent(event: any) {
        this.id = 0;
        this.selectedData = event.value;
        if (this.selectedData.length > 0) {
            this.id = this.selectedData[0]['ID'];
            this.isComponentloaded = true;
        }
        console.log('id=' + this.id);
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'headerselected':
            case 'rowselected':
                if (this.id > 0) {
                    this.isComponentloaded = true;
                }
                break;
            default:
                alert('not implimented');
                break;
        }
    }

    handleDocEvent(event: any) {
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'new message':
                this.loadEmptyTemplate();
                break;
            case 'message type':
                this.userId = event.value;
                this.messageCenter.userId = this.userId;
                this.getTemplateDataForUnRead();
                break;
            case 'save message':
                this.saveTemplateData();
                break;
                case 'view message':
                this.loadEmptyTemplate();
                break;
            // case "delete":
            //     this.deleteTemplate();
            //     break;
            // case "refresh":
            //     $("#txtSearch").val("");
            //     this.setDockControls();
            //     this.getTemplateData();
            //     break;
            case 'cancel':
                debugger;
                this.id = null;
                this.cancelEvent();
                break;


            default:
                alert('not implimented');
                break;
        }
    }

    cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $('input:checkbox').prop('checked', false);
        if (this.isComponentloaded) {
            this.toggleClick(1);
        }

        this.setDockControls();

        // this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.id = 0;
        // this.pageSubmit = false;
        // this.selectedIndex = -1;
        // this.headerSelected = false;

    }

    getSavedData(id: any) {

        this.apicall.get(ApiEndpoints.getdetails + '136/', id).subscribe(
            res => {
                debugger;
                if (res.json().ack == 'success') {
                    this.messageCenter = res.json().Data[0];
                    this.formGroup.get('template').setValue(this.messageCenter.emailBody);

                } else {
                    // this.loader.loading = false;
                    this.errorComponent.handleCustomError(MessageComponent.error_get);
                }

            },
            err => {
                // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    loadEmptyTemplate() {
        debugger;
        if (this.id != null && this.id > 0) {
            this.getSavedData(this.id);
        } else {
            // this.testModel = new TestModel();
            // this.listFormGroup.reset();
            this.messageCenter = new MessageCenter();
            this.userId = this.userInfo.getUserId();
            this.messageCenter.userId = this.userId;
            this.messageCenter.userName = this.userInfo.getUserName();
            this.formGroup.get('template').setValue('');
        }


        this.toggleClick(1);
        this.isComponentloaded = true;
        this.setDockControlsForSave();
    }

    toggleClick(flag: number) {
        $('#divTest').toggle(500);
        $('#divTable').toggle(500);

        if (flag == 1) {
            this.id = null;
        }
    }

    setDockControlsForSave() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.SaveMessage, true);
        this.addButtonToList(buttonconstants.Cancel, true);
    }


    setDockControls() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.MarkAsRead, false);
        this.addButtonToList(buttonconstants.MarkAsUnread, false);
        this.addButtonToList(buttonconstants.Delete, false);
        this.addButtonToList(buttonconstants.NewMessage, true);
        this.addButtonToList(buttonconstants.ViewMessage, false);
        this.addSelectToList(buttonconstants.Select, this.dloList, 'Message Type', this.userId == this.userInfo.getUserId() ? 0 : this.userId);
    }

    addButtonToList(buttonType: any, enable: boolean) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'button';
        this.dockControl.label = buttonType;
        this.dockControl.enable = enable;
        this.dockControl.value = '';
        this.dock.dockControls.push(this.dockControl);
    }

    addSelectToList(buttonType: any, options: any[], key: string, value) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'select';
        this.dockControl.label = buttonType;
        this.dockControl.enable = true;
        this.dockControl.value = value;
        this.dockControl.key = key;
        this.dockControl.controlOptions = options;
        this.dock.dockControls.push(this.dockControl);
    }

    // addSelectToList(enable: boolean) {
    //     this.dockControl = new DockControl();
    //     this.dockControl.type = "select";
    //     this.dockControl.label = '';
    //     this.dockControl.enable = enable;
    //     this.dockControl.key = "Message Type";
    //     this.dock.dockControls.push(this.dockControl);
    // }
}





