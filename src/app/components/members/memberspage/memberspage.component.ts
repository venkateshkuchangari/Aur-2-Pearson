import { Component, ViewChild } from '@angular/core';
import { Role } from '../../model/role.model';
import { User } from '../../model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { DloList } from '../../model/dlolist.model';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
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
import { SortModel } from '../../model/sort.model';
import { MessageComponent } from '../../common/error-message.component';
import { DynamicFormComponent } from '../../common/dynamic-form/dynamic-form.component';
import { SimpleDockComponent } from '../../common/simple-dock/simple-dock.component';

declare var $: any;

@Component({
    selector: 'memberspage',
    templateUrl: 'memberspage.component.html',
    styleUrls: ['memberspage.component.scss']
})
export class MemberspageComponent {
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
    // @ViewChild(DynamicFormComponent) childComponent: DynamicFormComponent;
    isComponentloaded: boolean;
    pageSize: number;
    pageIndex: number;
    totalRecords: number;
    selectedIndex: number;
    sortColumn: string;
    searchText: string;
    direction: number;
    isDesc = false;
    headerSelected: boolean;
    @ViewChild(DynamicFormComponent) childComponent: DynamicFormComponent;
    selectedData: any[];

    constructor(private apicall: ApiCallComponent, private router: Router
        , private auth: Auth, private http: Http
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        , private translate: TranslateService
        , private MembersPageInfo: PageInfoComponent
        , private pageIdComponent: PageIdComponent
        // , private loader: LoadingServiceComponent
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
        this.searchText = '';
        this.setDockControls();
        this.headerSelected = false;
        this.selectedData = [];
    }

    ngOnInit() {
        this.countryId = this.userInfo.getCountryId();
        this.MembersPageInfo = this.pageIdComponent.Members;
        this.translate.use('en');
        this.loadDetails();
       // debugger;
        this.currentUser = this.userInfo.getUserName();
       // debugger;
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
   /*  setDockControls() {
        this.dock.backgroundcolor = "#343a40";
        this.dockControl = new DockControl();
        this.dockControl.type = "button";
        this.dockControl.enable = true;
        this.dockControl.label = buttonconstants.AddorEdit;
        this.dock.dockControls.push(this.dockControl);

        this.dockControl = new DockControl();
        this.dockControl.type = "button";
        this.dockControl.label = buttonconstants.Save;
        this.dock.dockControls.push(this.dockControl);

        this.dockControl = new DockControl();
        this.dockControl.type = "button";
        this.dockControl.label = buttonconstants.Cancel;
        this.dock.dockControls.push(this.dockControl);

        this.dockControl = new DockControl();
        this.dockControl.type = "button";
        this.dockControl.label = buttonconstants.Delete;
        this.dock.dockControls.push(this.dockControl);

        this.dockControl = new DockControl();
        this.dockControl.type = "button";
        this.dockControl.label = buttonconstants.Refresh;
        this.dockControl.enable = true;
        this.dock.dockControls.push(this.dockControl);
    } */

    loadDetails() {
        const time = new Date();
        console.log('time1=' + time.toString());
        this.details = [];
        this.headerColumns = [];
        this.usersList = [];
        //  $('#example').DataTable().destroy();
        // // this.loader.loading = true;
        this.apicall.get(ApiEndpoints.getdetails, this.MembersPageInfo.templatedId + '/' + this.countryId).subscribe(
            res => {
                // // this.loader.loading = false;

                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                } else {
                    this.details = res.json();
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
                // this.snackBar.open(err, 'Error', {
                //     duration: 2000,
                // });
            });
    }

    /* loadDetails() {
        var time = new Date();
        this.details = [];
        this.headerColumns = [];
        this.usersList = [];
        // // this.loader.loading = true;
        this.apicall.get(ApiEndpoints.getdetails, this.MembersPageInfo.templatedId + "/0").subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
                else {
                    this.details = res.json();
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    } */

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

    /* toggleClick(flag: number) {
        this.showEntryPage = true;
        $("#divTest").toggle(500);
        $("#divTable").toggle(500);
        $("#divButtons").toggle(500);

        if (flag == 1) {
            this.selectedUser = new User();
            this.selectedId = null;

            this.pageInfo = new FormGroup({
                id: new FormControl(this.selectedId),
            });
        }
        else {

        }

        if (this.isComponentloaded) {
            this.setDockControlsForSave();
        }
        else {
            this.setDockControls()
        }
    } */

    /* handleDocEvent(event: any) {
        var eventType = event.eventInfo.toLowerCase();
        switch (eventType) {
            case "add/edit":
                this.getTemplateData();
                break;
            case "save":
                this.saveTemplateData();
                break;
            case "delete":
                this.deleteTemplate();
                break;
            case "refresh":
                $("#txtSearch").val("");
                this.cancelEvent();
                this.ngOnInit();
                break;
            case "cancel":
                this.cancelEvent();
                break;
            default:
                this.errorComponent.handleCustomError(MessageComponent.msg_notimplemented);
                break;
        }
    } */

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
                this.deleteTemplate();
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

    /* cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $("input:checkbox").prop("checked", false);
        if (this.isComponentloaded) {
            this.toggleClick(1);
        }
        this.dynamicObject = [];
        this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.id = "";
        this.selectedIndex = -1;
        //$('#example').DataTable();
    } */
    /* cancelEvent() {
        $('#example tr.selected').removeClass('selected');

        $("input:checkbox").prop("checked", false);
        if (this.isComponentloaded) {
            this.toggleClick(1);
        }
        this.setDockControls();
        this.dynamicObject = [];
        this.isAnyEdited = false;
        this.isComponentloaded = false;
        this.id = "";
        this.selectedIndex = -1;
        this.headerSelected = false;
    } */

    /* deleteTemplate() {
        if (this.id == "" || this.id == null) {
            this.snackBar.open(MessageComponent.error_selectfordelete, 'Error', {
                duration: 2000,
            });
        }
        else {
            this.apicall.post(ApiEndpoints.deleteCandidateDetails + this.id, null).subscribe(
                res => {
                    if (res.status == "201") {
                        this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                            duration: 2000,
                        });
                        this.cancelEvent();
                        this.loadDetails();
                    }
                    else {
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
    } */

    deleteTemplate() {
        const selectedRows = $('input[name=\'chkSelect\']:checked');
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
    }

    deleteRecordById(selectedData: string) {
        this.apicall.post(ApiEndpoints.deleteMemberDetails + selectedData, null).subscribe(
            res => {
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
    }
    /* getTemplateData() {
        this.saveCalled = false;
        if (this.id == "" || this.id == null) {
            this.id = 0;
        }
        // // this.loader.loading = true;
        this.apicall.get(ApiEndpoints.getMembersDetails, this.countryId + "/member/" + this.id).subscribe(
            res => {
                // // this.loader.loading = false;
                if (this.isComponentloaded != true) {
                    this.toggleClick(1);
                }
                this.isComponentloaded = true;
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
                else {
                    this.dynamicObject = res.json();
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    } */

    getTemplateData() {
        this.saveCalled = false;
        if (this.id == '' || this.id == null) {
            this.id = 0;
        }
        // //  this.loader.loading = true;

        this.apicall.get(ApiEndpoints.getMemberDetails, this.countryId + '/member/' + this.id).subscribe(
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
        debugger;
        /*  */
        if (!this.isComponentloaded) {
            return false;
        }
        let endPoint = ApiEndpoints.saveMemberDetails;
        if (this.id > 0) {
            endPoint = ApiEndpoints.updateMemberDetails;
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
            /*  */
    }

    pageSizeChange() {
        this.usersList = this.details.Data.slice(0, this.pageSize);
        this.getPageIndexArray();
    }

    getPageIndexArray() {
        this.pageIndexList = [];
        const maxIndex = Math.ceil(this.details.Data.length / this.pageSize);
        for (let cnt = 1; cnt <= maxIndex; cnt++) {
            this.pageIndexList.push(cnt);
        }

        if (this.pageIndexList.length == 0) {
            this.pageIndexList.push(1);
        }
    }










    applyDataTable() {


    }

    ngAfterViewInit() {

    }


    /* onItemSelect(item) {
        console.log('Selected Item:');
        console.log(item);
    }
    OnItemDeSelect(item) {
        console.log('De-Selected Item:');
        console.log(item);
    }

    getDloList() {
        this.apicall.get(ApiEndpoints.getdloList, "9").subscribe(
            res => {
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                }
                else {
                    this.dloList = res.json();
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    } */

    /* init() {

        //   if (this.currentUser) {
        //     this.userApi.getRoles().subscribe((roles) => {
        // this.roles = roles;
        // this.getUsersList();
        // });
        //   }
    } */

    getLoginUserInfo() {
        debugger;
        this.apicall.get(ApiEndpoints.getLoginUserInfo, this.userInfo.getUserName()).subscribe(
            res => {
                if (res.json().error != null) {
                    // this.errorComponent = res.json();
                } else {
                    this.userData = res.json();
                    debugger;
                }
            },
            err => {
                // this.errorComponent = err;
            });
            debugger;
    }
    table: any;

    loadJsonData() {
        $('#example').remove();
        $('#example_wrapper').remove();
        $('#example').DataTable().destroy();
        // var dynamicColumns = [];
        // var i = 0;
        // $.each(this.details.Data[0], function (key, value) {
        //     var obj = { sTitle: key };
        //     dynamicColumns[i] = obj;
        //     i++;
        // });

        // this.headerColumns = dynamicColumns;

        // var sliceIndex = 100;

        // var length: number = 108;
        // this.usersList = [];
        // var temp = [];

        // console.log("records count1=" + this.details.Data.length);
        // this.usersList = this.details.Data.slice(0, 10);
        // console.log("records count2=" + this.usersList.length);
        // $('example tr.selected').removeClass('selected');
        setTimeout(function () {
            $('#example').DataTable().destroy();
            // $('#example thead tr#filterrow th').each(function () {
            //     var title = $('#example thead th').eq($(this).index()).text();
            //    if(title != 'Select') {
            //     $(this).html('<input class="form-control" type="text"   placeholder="Search" />');
            //    }
            // });

            // $("#example thead input").on('keyup change', function () {
            //     table
            //         .column($(this).parent().index() + ':visible')
            //         .search(this.value)
            //         .draw();
            // });
            // DataTable
            // $('#example tbody').on('click', 'tr', function () {
            //     table.$('input').prop("checked",false);
            //     if ($(this).hasClass('selected')) {

            //         $(this).removeClass('selected');
            //     }
            //     else {
            //         table.$('tr.selected').removeClass('selected');
            //         $(this).addClass('selected');
            //         $(this).find("input").prop("checked",true);
            //     }
            // });

            const table = $('#example').DataTable({
                // orderCellsTop: false,
                'scrollX': true,
                'colReorder': true,
                'bDestroy': true,
                'bScrollCollapse': true,
                'bJQueryUI': false,
                'bPaginate': false,
                'sScrollY': '100%',
                'bInfo': false,
                'bFilter': false,
                'bSort': false,
                //  "dom": '<"top"i>rt<"top"flp><"clear">',
                // "lengthMenu": [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
                // "language": {
                //     // "lengthMenu": "Display MENU records per page",
                //       "zeroRecords": "No records available",
                //       "info": "",
                //      "infoEmpty": "No records available",
                //      "infoFiltered": "_PAGES_ of _MAX_ records found based on the filter criteria"
                // },
                // order: [],
                // columnDefs: [ { orderable: false, targets: [0]}],
                initComplete: function () {
                    //   $("#example_filter").detach();
                    $('#filterrow').find('th').removeClass();
                    $('#example').find('th').eq(0).removeClass('sorting_asc');
                    // $(['data-column-index = 0']).removeClass();
                }
            });

            //  $('#txtSearch').on( 'keyup', function () {
            //         table.search( this.value ).draw();
            //     });


            function stopPropagation(evt) {
                if (evt.stopPropagation !== undefined) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }
            }
            const time = new Date();
            console.log('time3=' + time.toString());
            // });
        }
            , 500);

    }


    loadJsonData11() {
        $('#example').remove();
        $('#example_wrapper').remove();

        const dynamicColumns = [];
        let i = 0;
        $.each(this.details.Data[0], function (key, value) {
            const obj = { sTitle: key };
            dynamicColumns[i] = obj;
            i++;
        });

        this.headerColumns = dynamicColumns;

        const sliceIndex = 100;

        const length = 108;
        this.usersList = [];
        const temp = [];

        console.log('records count1=' + this.details.Data.length);
        //this.usersList = this.details.Data;
        this.usersList = this.details.Data.slice(0, 300);
        console.log('records count2=' + this.usersList.length);
        $('example tr.selected').removeClass('selected');
        setTimeout(function () {
            $('#example').DataTable().destroy();
            // $(function () {
            $('#example thead tr#filterrow th').each(function () {
                const title = $('#example thead th').eq($(this).index()).text();
                // $(this).html('<input class="form-control" type="text" onclick="stopPropagation(event);" placeholder="Search ' + title + '" />');
                if (title != 'Select') {
                    $(this).html('<input class="form-control" type="text"   placeholder="Search" />');
                }
            });

            $('#example thead input').on('keyup change', function () {
                table
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();
            });
            // DataTable
            $('#example tbody').on('click', 'tr', function () {
                // $(this).parent().find("input").prop("checkd",false);

                // $(this).find("input").prop("checked",!$(this).find("input").prop("checked"));
                // $(this).find("input").prop("checked",true);

                // console.log( table.row(this).data());
                // var cell = table.cell(this);
                // cell.data( cell.data() + 1 ).draw();
                const data = table.row(this).data();
                // alert('You clicked on ' + data + '\'s row');
                const allData = table.columns().data();
                // alert('You clicked on columns ' + allData + '\'s row');

                table.$('input').prop('checked', false);
                if ($(this).hasClass('selected')) {

                    $(this).removeClass('selected');
                } else {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    $(this).find('input').prop('checked', true);
                }

            });

            const table = $('#example').DataTable({
                orderCellsTop: true,
                'scrollX': true,
                'colReorder': true,
                'bDestroy': true,
                'bScrollCollapse': true,
                'bJQueryUI': true,
                'bPaginate': true,
                'sScrollY': '300px',
                'bInfo': true,
                //     "bFilter": false,
                'bSort': true,
                'dom': '<"top"i>rt<"top"flp><"clear">',
                /*                     "language": {
                                        "zeroRecords": "Nothing found - sorry",
                                        //"info": "Showing page PAGE of _PAGES_",
                                          "info": "Showing PAGES of MAX records ",
                                        "infoEmpty": "No records available",
                                        "infoFiltered": "found based on the filter criteria"
                                    } */
                'lengthMenu': [[10, 25, 50, 100, 500, 1000], [10, 25, 50, 100, 500, 1000]],
                'language': {
                    // "lengthMenu": "Display MENU records per page",
                    'zeroRecords': 'No records available',
                    'info': '',
                    'infoEmpty': 'No records available',
                    'infoFiltered': '_PAGES_ of _MAX_ records found based on the filter criteria'
                },
                order: [],
                columnDefs: [{ orderable: false, targets: [0] }],
                // "columnDefs": [ {

                //     "targets": [-1, 0, 1, 2], // column or columns numbers

                //     "orderable": false,  // set orderable for selected columns

                //     }],
                initComplete: function () {
                    $('#example_filter').detach();
                    $('#filterrow').find('th').removeClass();


                }
            });

            $('#txtSearch').on('keyup', function () {
                table.search(this.value).draw();
            });

            /////
            // // $("#dataTables_filter").hide();

            function stopPropagation(evt) {
                if (evt.stopPropagation !== undefined) {
                    evt.stopPropagation();
                } else {
                    evt.cancelBubble = true;
                }
            }
            const time = new Date();
            console.log('time3=' + time.toString());
            // });


        }
            , 500);

    }



    getUsersList() {
    }

    getRoles() {
        this.apicall.get(ApiEndpoints.getRoles, null).subscribe(
            res => {
                if (res.json().error != null) {
                    this.snackBar.open(res.json().error_description, 'Error', {
                        duration: 2000,
                    });
                } else {
                    this.roles = res.json();
                }
            },
            err => {
                // this.errorComponent = err;
            });
    }

    openDialog(flag: boolean): void {
        if (!flag) {
            this.selectedId = null;
            this.selectedUser = new User();
        }

    }

    /* toggleClick(flag: number) {
        this.showEntryPage = true;
        $("#divTest").toggle(500);
        $("#divTable").toggle(500);
        $("#divButtons").toggle(500);

        if (flag == 1) {
            this.selectedUser = new User();
            this.selectedId = null;

            this.pageInfo = new FormGroup({
                id: new FormControl(this.selectedId),
            });
            // this.getUsersList();
            //  this.getJsonData();
        }

        // this.getRoles();
    } */

    /* handleTableEvent(event: any) {
        // this.toggleClick(1);
    }

    clearSelectedRow() {
        this.selectedUser = new User();
        this.selectedId = null;
        this.selectedIndex = -1;
        this.id = "";
        // $("#example").DataTable();
    } */

    /* getSelectedRow(rowIndex, selectedRow: any) {
        // console.log($("input:checkbox").eq(rowIndex).prop("checked"));
        $("#example").find("input:checkbox").prop("checked", false);
        console.log("selectedRow=" + selectedRow["ID"]);
        if (this.id != selectedRow["ID"]) {
            this.id = selectedRow["ID"];
            this.selectedIndex = rowIndex;
            // $("#example").find("tr").eq(rowIndex).addClass("selected");
            $("#example").find("input:checkbox").eq(rowIndex).prop("checked", true);
            //    this.id = 130017;
            //this.getTemplateData();
        }
        else {
            this.id = "";
            this.selectedIndex = -1;
            this.selectedId = null;
            $("#example").find("input:checkbox").eq(rowIndex).prop("checked", false);
        }
        //return false;
    } */

    /* selectUser(row: User) {

        this.selectedId = row.memberId;
        this.selectedUser = row;
        this.pageInfo.controls['id'].setValue(this.selectedId);
    } */

    /* logout() {
        this.auth.logout();
        this.router.navigateByUrl('login');
    } */

    /* isEditdisabled() {
        let isDisabled = true;
        if (this.selectedId != null) {
            isDisabled = false;
        }

        return isDisabled;
    } */


















    /*  */

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
