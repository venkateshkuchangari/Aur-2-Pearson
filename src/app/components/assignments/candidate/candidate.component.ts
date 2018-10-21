import { Component, ViewChild } from '@angular/core';
import { Role } from '../../model/role.model';
import { User } from '../../model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Dock, DockControl } from '../../common/dock.controls';
import { ApiCallComponent } from '../../../services/apicall.component';
import { Router } from '@angular/router';
import { Auth } from '../../../services/Auth';
import { Http } from '@angular/http';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { PageInfoComponent, PageIdComponent } from '../../common/pageid.component';
import { ErrorComponent } from '../../../services/error.component';
import * as buttonconstants from '../../common/app.buttonconstants';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { FarmModel } from '../../model/farm.model';
import { DloList } from '../../model/dlolist.model';
import { DynamicFormComponent } from '../../common/dynamic-form/dynamic-form.component';
import { MessageComponent } from '../../common/error-message.component';
declare var $: any;

@Component({
    selector: 'candidate',
    templateUrl: 'candidate.component.html',
    styleUrls: ['candidate.component.scss']
})

export class CandidateComponent {
    currentUser: any;
    // displayedColumns: any = ['userName', 'country', 'email'];
    displayedColumns: any = ['userName'];
    public usersData: any;
    roles: Role[];
    selectedId: string;
    userData: User;
    selectedUser: User;
    users: any;
    animate: any;
    pageInfo: FormGroup;
    headerColumns: any[];
    usersList: any[];
    dloList: DloList[];
    showEntryPage: boolean;
    details: any;
    id: any;
    dock: Dock;
    dynamicObject;
    dockControl: DockControl;
    isAnyEdited: boolean;
    countryId: string;
    saveCalled: boolean;
    pageIndexList: any[];
    @ViewChild(DynamicFormComponent) childComponent: DynamicFormComponent;
    isComponentloaded: boolean;
    pageSize: number;
    pageIndex: number;
    totalRecords: number;
    allRecords: number;
    selectedIndex: number;
    sortColumn: string;
    searchText: string;
    direction: number;
    isDesc = false;
    dataFiltered: boolean;
    headerSelected: boolean;
    selectedData: any[];

    constructor(private apicall: ApiCallComponent, private router: Router
        , private auth: Auth, private http: Http
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        , private translate: TranslateService
        , private candidatePageInfo: PageInfoComponent
        , private pageIdComponent: PageIdComponent
        , private errorComponent: ErrorComponent
    ) {
        this.userData = new User();
        this.selectedUser = new User();
        this.users = [];
        this.animate = 'right';
        this.headerColumns = [];
        this.usersList = [];
        this.dloList = [];
        this.showEntryPage = false;
        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dynamicObject = [];
        this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.saveCalled = false;
        this.pageSize = 100;
        this.pageIndexList = [];
        this.pageIndex = 1;
        this.selectedIndex = -1;
        this.sortColumn = '';
        this.dataFiltered = false;
        this.headerSelected = false;
        this.searchText = '';
        this.selectedData = [];
        this.setDockControls();
    }

    ngOnInit() {

        this.countryId = this.userInfo.getCountryId();
        this.candidatePageInfo = this.pageIdComponent.candidatepage_id;
        this.translate.use('en');
        this.loadDetails();

        this.currentUser = this.userInfo.getUserName();
    }

    setDockControlsForSave() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
    }

    setDockControls() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.AddorEdit, true);
        this.addButtonToList(buttonconstants.Delete, false);
        this.addButtonToList(buttonconstants.Refresh, true);
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
            case 'add/edit':
                this.getTemplateData();
                break;
            case 'save':
                this.saveTemplateData();
                break;
            case 'delete':
                if (confirm(MessageComponent.msg_confirm)) {
                    this.deleteTemplate();
                }
                break;
            case 'refresh':
                $('#txtSearch').val('');
                this.ngOnInit();
                break;
            case 'cancel':
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
        this.dynamicObject = [];
        this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.id = '';
        this.selectedIndex = -1;
        this.headerSelected = false;
    }

    deleteTemplate() {
        //debugger;
        const selectedRows = $('input[name=\'chkSelect\']:checked');
        //debugger;
        if (this.id.length == 0) {
            this.snackBar.open(MessageComponent.error_selectfordelete, 'Error', {
                duration: 2000,
            });
        } else {
            // this.loader.loading = true;
            for (let cnt = 0; cnt < this.selectedData.length; cnt++) {
                this.deleteRecordById(this.selectedData[cnt]['ID']);

                if (cnt + 1 == this.selectedData.length) {
                    this.isComponentloaded = false;
                    this.selectedData = [];
                    this.id = null;
                    this.cancelEvent();
                    this.loadDetails();
                }
                
            }
        }
        //debugger;
    }

    deleteRecordById(selectedData: string) {
        //debugger;
        this.apicall.post(ApiEndpoints.deleteCandidateDetails + selectedData, null).subscribe(
            res => {
                //debugger;
                this.loadDetails();
                //this.ngOnInit();
                if (res.status == '201') {
                    this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                        duration: 2000,
                    });
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
        //debugger;
    }

    getTemplateData() {
        //debugger;
        this.saveCalled = false;
        if (this.id == '' || this.id == null) {
            this.id = 0;
        }
        //this.loader.loading = true;

        this.apicall.get(ApiEndpoints.getCandidateDetails, this.countryId + '/candidate/' + this.id).subscribe(
            res => {
                // // this.loader.loading = false;
                if (this.isComponentloaded != true) {
                    this.isComponentloaded = true;
                    this.toggleClick(1);
                }

                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                } else {
                    this.dynamicObject = res.json();
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    saveTemplateData() {
        if (!this.isComponentloaded) {
            return false;
        }
        let endPoint = ApiEndpoints.saveCandidateDetails;
        if (this.id > 0) {
            endPoint = ApiEndpoints.updateCandidateDetails;
        }
        const savedData: FarmModel[] = this.childComponent.getDynamicFarmValue();
        if (!savedData) {
            return;
        }
        this.saveCalled = true;
        // // this.loader.loading = true;
        console.log(savedData);
        this.apicall.post(endPoint, savedData).subscribe(
            res => {
                // // this.loader.loading = false;
                this.saveCalled = false;
                if (res.status == '201') {
                    this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                        duration: 2000,
                    });

                    this.cancelEvent();
                    this.loadDetails();
                } else {
                    this.saveCalled = false;
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
            },
            err => {
                // // this.loader.loading = false;
                this.saveCalled = false;
                this.errorComponent.handleError(err);
            });
    }


    loadDetails() {
        //debugger;
        const time = new Date();
        this.details = [];
        this.headerColumns = [];
        this.usersList = [];
        //debugger;
        // // this.loader.loading = true;
        this.apicall.get(ApiEndpoints.getdetails, this.candidatePageInfo.templatedId + '/0').subscribe(
            res => {
                //debugger;
                // // this.loader.loading = false;
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                } else {
                    this.details = res.json();
                }
                //debugger;
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
        //debugger;
    }


    onItemSelect(item) {
        console.log('Selected Item:');
        console.log(item);
    }
    OnItemDeSelect(item) {
        console.log('De-Selected Item:');
        console.log(item);
    }

    getDloList() {
        this.apicall.get(ApiEndpoints.getdloList, '9').subscribe(
            res => {
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                } else {
                    this.dloList = res.json();
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

    init() {

    }


    toggleClick(flag: number) {
        this.showEntryPage = true;
        $('#divTest').toggle(500);
        $('#divTable').toggle(500);
        $('#divButtons').toggle(500);

        if (flag == 1) {
            this.selectedUser = new User();
            this.selectedId = null;

            this.pageInfo = new FormGroup({
                id: new FormControl(this.selectedId),
            });
        } else {

        }

        if (this.isComponentloaded) {
            this.setDockControlsForSave();
        } else {
            this.setDockControls();
        }
    }

    handleTableEvent(event: any) {
        this.id = 0;
        this.selectedData = event.value;
        if (this.selectedData.length > 0) {
            this.id = this.selectedData[0]['ID'];
            this.isComponentloaded = false;
        }
        console.log('id=' + this.id);
        const eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case 'headerselected':
            case 'rowselected':
                if (this.id > 0) {
                    this.isComponentloaded = false;
                }
                break;
            default:
                alert('not implimented');
                break;
        }
    }

    clearSelectedRow() {
        this.selectedUser = new User();
        this.selectedId = null;
        this.selectedIndex = -1;
        this.id = '';
        // $("#example").DataTable();
    }

    getSelectedRowAll() {
        this.headerSelected = $('#chkAllSelect').prop('checked');
        this.id = '';
        this.selectedIndex = -1;
        this.selectedId = null;
        $('#example').find('input:checkbox').prop('checked', $('#chkAllSelect').prop('checked'));
    }

    getSelectedRow(rowIndex, selectedRow: any) {
        this.headerSelected = false;
        $('#example').find('input:checkbox').prop('checked', false);
        console.log('selectedRow=' + selectedRow['ID']);
        if (this.id != selectedRow['ID']) {
            this.id = selectedRow['ID'];
            this.selectedIndex = rowIndex;
            $('input[data_id=' + rowIndex + ']').prop('checked', true);
        } else {
            this.id = '';
            this.selectedIndex = -1;
            this.selectedId = null;
            $('input[data_id=' + rowIndex + ']').prop('checked', false);
        }
    }

    selectUser(row: User) {

        this.selectedId = row.memberId;
        this.selectedUser = row;
        this.pageInfo.controls['id'].setValue(this.selectedId);
    }

    isEditdisabled() {
        let isDisabled = true;
        if (this.selectedId != null) {
            isDisabled = false;
        }
        return isDisabled;
    }
}
