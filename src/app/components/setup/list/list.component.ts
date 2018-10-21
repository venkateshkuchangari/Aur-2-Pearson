import { Component } from '@angular/core';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListModel } from './list.model';
import { ApiCallComponent } from '../../../services/apicall.component';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { ErrorComponent } from '../../../services/error.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { User } from '../../model/user.model';
import * as buttonconstants from '../../common/app.buttonconstants';
import { Observable } from 'rxjs/Observable';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { MessageComponent } from '../../common/error-message.component';

declare var $: any;

@Component({
    selector: 'list',
    templateUrl: 'list.component.html',
    styleUrls: ['list.component.scss']
})

export class ListComponent {
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    details: any;
    isComponentloaded: boolean;
    listFormGroup: FormGroup;
    listModel: ListModel;
    pageSubmit: boolean;
    parent_data_col_var_opt_id: KeyValuePair[];
    selectedData: any[];
    dataCollectionVariableId: number;
    dockValue: number;
    headerSelected: boolean;
    constructor(private apicall: ApiCallComponent, private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private errorComponent: ErrorComponent
    ) {
        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dloList = [];
        this.isComponentloaded = false;
        this.listModel = new ListModel();
        this.pageSubmit = false;
        this.parent_data_col_var_opt_id = [];
        this.selectedData = [];
        this.dataCollectionVariableId = 0;
        this.dockValue = 0;
        this.headerSelected = false;
    }

    ngOnInit() {
        this.listFormGroup = new FormGroup({
            dataColVarOptId: new FormControl(this.listModel.dataColVarOptId),
            dataCollectionVariableId: new FormControl(this.listModel.dataCollectionVariableId),
            dataColVarOptDesc: new FormControl(this.listModel.dataColVarOptDesc, [Validators.required]),
            sortOrder: new FormControl(this.listModel.sortOrder, [Validators.required]),
            isEditable: new FormControl(this.listModel.isEditable),
            abbreviation: new FormControl(this.listModel.abbreviation, [Validators.required]),
            parentDataColVarOptId: new FormControl(this.listModel.parentDataColVarOptId),
        });

        this.translate.use('en');
        this.getDloList();
        this.getparent_data_col_var_opt_id();
    }

    setDockControls() {
        this.dock.backgroundcolor = '#343a40';
        this.dock.dockControls = [];
        this.addButtonToList(buttonconstants.AddorEdit, true);
        this.addButtonToList(buttonconstants.Delete, false);
        this.addButtonToList(buttonconstants.Refresh, false);
        this.addSelectToList(buttonconstants.Select, []);
    }

    addButtonToList(buttonType: any, enable: boolean) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'button';
        this.dockControl.label = buttonType;
        this.dockControl.enable = enable;
        this.dock.dockControls.push(this.dockControl);
    }

    addSelectToList(buttonType: any, options: any[]) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'select';
        this.dockControl.label = buttonType;
        this.dockControl.enable = true;
        this.dockControl.value = this.dockValue;
        this.dockControl.key = 'List';
        this.dockControl.controlOptions = options;
        this.dock.dockControls.push(this.dockControl);
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

    deleteTemplate() {
        const selectedRows = $('input[name=\'chkSelect\']:checked');
        if (this.id.length == 0) {
            this.snackBar.open('Please select row to delete', 'Error', {
                duration: 2000,
            });
        } else {
            // this.loader.loading = true;
            if (confirm('Are you sure you want to delete ?')) {
                let deletedCount = 0;
                for (let cnt = 0; cnt < this.selectedData.length; cnt++) {
                    this.deleteRecordById(this.selectedData[cnt]['ID']).subscribe(res => {
                        if (res) {
                            deletedCount += 1;
                        }
                        if (deletedCount == this.selectedData.length) {
                            this.isComponentloaded = false;
                            this.selectedData = [];
                            this.id = null;
                            this.getTemplateData(this.dockValue);
                            this.errorComponent.handleCustomError(MessageComponent.msg_deletesuccess);
                            this.snackBar.open('Data deleted', 'Success', {
                                duration: 2000,
                            });
                            // this.loader.loading = false;
                        }
                    });
                }
            }
        }
    }

    deleteRecordById(selectedData: string): Observable<any> {
        return this.apicall.delete(ApiEndpoints.deleteList + selectedData, null).map(
            res => {
                if (res.status != '200') {

                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
                return true;
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
                return true;
            });
    }

    b64DecodeUnicode(str: string): string {
        if (window
            && 'atob' in window
            && 'decodeURIComponent' in window) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), (c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } else {
            console.warn('b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions');
            return null;
        }
    }

    getSavedData(id: any) {
        this.apicall.get(ApiEndpoints.getRecord, id).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    const data = res.json().Data[0];
                    this.listFormGroup.setValue({
                        dataColVarOptId: data.data_col_var_opt_id,
                        sortOrder: data.sort_order,
                        isEditable: data.is_editable,
                        dataCollectionVariableId: data.data_collection_variable_id == null ? '' : data.data_collection_variable_id,
                        dataColVarOptDesc: data.data_col_var_opt_desc,
                        parentDataColVarOptId: data.parent_data_col_var_opt_id,
                        abbreviation: data.abbreviation
                    });

                    $('select[id=\'selectpicker\']').selectpicker('refresh');
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

    handleDocEvent(event: any) {
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'add/edit':
                this.loadEmptyTemplate();
                break;
            case 'save':
                this.saveTemplateData();
                break;
            case 'delete':
                this.deleteTemplate();
                break;
            case 'refresh':
                $('#txtSearch').val('');
                this.details.Data = [];
                this.getTemplateData(this.dockValue);
                break;
            case 'cancel':
                this.cancelEvent();
                break;
            case 'list':
                this.dockValue = event.value;
                this.getTemplateData(event.value);
                break;
            default:
                this.errorComponent.handleCustomError(MessageComponent.msg_notimplemented);
                break;
        }
    }

    cancelEvent() {
        $('#example tr.selected').removeClass('selected');
        $('input:checkbox').prop('checked', false);
        if (this.isComponentloaded) {
        this.toggleClick(1);
        }
        this.isComponentloaded = false;
        this.getDloList();
        this.id = '';
        this.pageSubmit = false;
        this.listFormGroup.reset();
    }

    setDockControlsForSave() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
    }

    getparent_data_col_var_opt_id() {
        this.parent_data_col_var_opt_id = [];
        this.apicall.get(ApiEndpoints.getdetails, '68/242').subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.parent_data_col_var_opt_id = res.json().Data;
                } else {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

    clearAfterSave() {
        this.getTemplateData(this.dockValue);
        this.cancelEvent();
        this.setDockControls();
    }

    saveTemplateData() {
        if (!this.isComponentloaded) {
            return false;
        }
        this.pageSubmit = true;
        if (this.listFormGroup.valid) {
            this.listModel = this.listFormGroup.value;
            let url = ApiEndpoints.saveList;
            if (this.listModel.dataColVarOptId > 0) {
                url = ApiEndpoints.updateList;
                this.apicall.put(url, this.listModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '200') {
                            this.snackBar.open(MessageComponent.msg_updatesuccess, 'Success', {
                                duration: 2000,
                            });
                            this.clearAfterSave();
                        } else {
                            this.errorComponent.handleCustomError(MessageComponent.error_save);
                        }
                    },
                    err => {
                        // // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            } else {
                this.listModel.dataCollectionVariableId = this.dataCollectionVariableId;
                this.apicall.post(url, this.listModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '201') {
                            this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                                duration: 2000,
                            });
                            this.clearAfterSave();
                        } else {
                            this.errorComponent.handleCustomError(MessageComponent.error_save);
                        }
                    },
                    err => {
                        // // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            }
        }
    }

    loadEmptyTemplate() {
        if (this.dockValue == 0) {
            this.errorComponent.handleCustomError(MessageComponent.msg_select);
            return false;
        }
        if (this.id != null && this.id != '' && this.id > 0) {
            this.getSavedData(this.id);
        } else {
            this.listModel = new ListModel();
            this.id = null;
        }
        this.toggleClick(1);
        this.isComponentloaded = true;
        this.setDockControlsForSave();
        $('select[id=\'selectpicker\']').selectpicker('refresh');
    }

    getTemplateData(id: any) {
        this.dataCollectionVariableId = id;
        if (id == '' || id == null || id == 0) {
            this.details = false;
        } else {
            // // this.loader.loading = true;
            this.apicall.get(ApiEndpoints.getdetails, '55/' + id).subscribe(
                res => {
                    // // this.loader.loading = false;
                    if (res.json().ack == 'success') {
                        this.details = res.json();
                    } else {

                    }
                },
                err => {
                    // // this.loader.loading = false;
                    this.errorComponent.handleError(err);
                });
        }
    }
    getDloList() {
        this.dloList = [];
        this.apicall.get(ApiEndpoints.getdetails, '66/242').subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.dloList = res.json().Data;
                    this.dock.backgroundcolor = '#343a40';
                    this.dock.dockControls = [];
                    this.addButtonToList(buttonconstants.AddorEdit, true);
                    this.addButtonToList(buttonconstants.Delete, false);
                    this.addButtonToList(buttonconstants.Refresh, true);
                    this.addSelectToList(buttonconstants.Select, this.dloList);
                    const date = new Date();
                    this.dock.guid = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
                } else {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                    this.dock.backgroundcolor = '#343a40';
                    this.dock.dockControls = [];
                    this.addButtonToList(buttonconstants.AddorEdit, true);
                    this.addButtonToList(buttonconstants.Delete, false);
                    this.addButtonToList(buttonconstants.Refresh, false);
                    this.addSelectToList(buttonconstants.Select, []);
                }

                $('select[id=\'selectpicker\']').selectpicker('refresh');
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

    toggleClick(flag: number) {
        $('#divTest').toggle(300);
        $('#divTable').toggle(300);
        if (flag == 1) {
            this.id = null;
        }
    }

}
