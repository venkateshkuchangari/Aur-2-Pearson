import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import * as buttonconstants from '../../common/app.buttonconstants';
import { repeat } from 'rxjs/operator/repeat';
import { Observable } from 'rxjs/Observable';
import { forEach } from '@angular/router/src/utils/collection';
import { ApiCallComponent } from '../../../services/apicall.component';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { ErrorComponent } from '../../../services/error.component';
import { Dock, DockControl, KeyValuePair } from '../../common/dock.controls';
import { TestModel } from './test.model';
import { ParentTestTypeModel } from './parenttesttype.model';
import { TestTypeModel } from './testtype.model';
import { RaterTypeModel } from './ratertype.model';
import { TestFlatFormModel } from './testplatform.model';
import { ApiEndpoints } from '../../../services/apiendpoints';
import { MessageComponent } from '../../common/error-message.component';

declare var $: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.scss'],
})
export class TestComponent implements OnInit {
    options: FormGroup;
    id: any;
    dock: Dock;
    dockControl: DockControl;
    dloList: KeyValuePair[];
    details: any;
    isComponentloaded: boolean;
    listFormGroup: FormGroup;
    testModel: TestModel;
    pageSubmit: boolean;
    parent_data_col_var_opt_id: KeyValuePair[];
    parentTestTypeModel: ParentTestTypeModel[];
    testTypeModel: TestTypeModel[];
    raterTypeModel: RaterTypeModel[];
    testFlatFormModel: TestFlatFormModel[];
    isRowSelected: boolean;
    selectedData: any[];
    countryId: any;
    headerSelected: boolean;
    constructor(private apicall: ApiCallComponent, private router: Router
        , private translate: TranslateService
        , private userInfo: UserInfoComponent, public snackBar: MatSnackBar
        // , private loader: LoadingServiceComponent
        , private errorComponent: ErrorComponent) {

        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dloList = [];
        this.isComponentloaded = false;
        this.testModel = new TestModel();
        this.pageSubmit = false;
        this.parent_data_col_var_opt_id = [];
        this.parentTestTypeModel = [];
        this.testTypeModel = [];
        this.raterTypeModel = [];
        this.testFlatFormModel = [];
        this.isRowSelected = false;
        this.headerSelected = false;
    }

    ngOnInit() {
        this.countryId = this.userInfo.getCountryId();

        this.listFormGroup = new FormGroup({
            testId: new FormControl(this.testModel.testId),
            testType: new FormControl(this.testModel.testType, [Validators.required]),
            name: new FormControl(this.testModel.name, [Validators.required]),
            published: new FormControl(this.testModel.published),
            minAge: new FormControl(this.testModel.minAge),
            maxAge: new FormControl(this.testModel.maxAge),
            minGrade: new FormControl(this.testModel.minGrade),
            maxGrade: new FormControl(this.testModel.maxGrade),
            parentTestId: new FormControl(this.testModel.parentTestId),
            acronym: new FormControl(this.testModel.acronym),
            testNavIdentifier: new FormControl(this.testModel.testNavIdentifier),
            raterTypeId: new FormControl(this.testModel.raterTypeId),
            lang: new FormControl(this.testModel.lang),
            serveyId: new FormControl(this.testModel.serveyId),
            panelId: new FormControl(this.testModel.panelId),
            testPlatFormId: new FormControl(this.testModel.testPlatFormId),
            isStartPointAgeRequired: new FormControl(this.testModel.isStartPointAgeRequired),
            isApiEnabled: new FormControl(this.testModel.isApiEnabled),
            apiAppName: new FormControl(this.testModel.apiAppName),
            apiTestLinkId: new FormControl(this.testModel.apiTestLinkId),
            countryId: new FormControl(this.countryId),
            apiTestLinkName: new FormControl(this.testModel.apiTestLinkName),
        });

        this.translate.use('en');

        // $("select[id='selectpicker']").selectpicker();
        this.loadAllDdls();

        this.setDockControls();
        this.getTemplateData();
    }

    setDockControls() {
        this.dock.backgroundcolor = '#343a40';
        this.dock.dockControls = [];
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

    addSelectToList(buttonType: any, options: any[]) {
        this.dockControl = new DockControl();
        this.dockControl.type = 'select';
        this.dockControl.label = buttonType;
        this.dockControl.enable = true;
        this.dockControl.controlOptions = options;
        this.dock.dockControls.push(this.dockControl);
    }

    handleTableEvent(event: any) {
        this.id = 0;
        this.selectedData = event.value;
        if (this.selectedData.length > 0) {
            this.id = this.selectedData[0]['id'];
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

    getSavedData(id: any) {

        this.apicall.get(ApiEndpoints.getdetails + '74/', id).subscribe(
            res => {
                if (res.json().ack === 'success') {
                    const data = res.json().Data[0];
                    this.listFormGroup.setValue({
                        testId: data.test_id,
                        testType: data.test_type,
                        name: data.name,
                        published: data.published,
                        minAge: data.min_age,
                        maxAge: data.max_age,
                        minGrade: data.min_grade,
                        maxGrade: data.max_grade,
                        parentTestId: data.parent_test_id,
                        acronym: data.acronym,
                        testNavIdentifier: data.test_nav_identifier,
                        raterTypeId: data.rater_type_id,
                        lang: data.lang,
                        serveyId: data.survey_id,
                        panelId: data.panel_id,
                        testPlatFormId: data.test_plat_form_id,
                        isStartPointAgeRequired: data.is_start_point_age_required,
                        isApiEnabled: data.is_api_enabled,
                        apiAppName: data.api_app_name,
                        apiTestLinkId: data.api_test_link_id,
                        countryId: data.country_id,
                        apiTestLinkName: data.api_test_link_name,

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
                this.setDockControls();
                this.getTemplateData();
                break;
            case 'cancel':
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
        this.id = '';
        this.pageSubmit = false;
        // this.selectedIndex = -1;
        // this.headerSelected = false;
        setTimeout(function () {
            $('select[id=\'selectpicker\']').val('');
            $('select[id=\'selectpicker\']').selectpicker('refresh');
        }
            , 500);
    }

    loadAllDdls() {
        this.getParentTestType();
        this.getTestType();
        this.getRaterType();
        this.getTestPlatForm();

    }

    getParentTestType() {

        this.getDloList('65/' + this.countryId).subscribe((res: any) => {
            for (let cnt = 0; cnt < res.length; cnt++) {
                const testType: ParentTestTypeModel = new ParentTestTypeModel();
                testType.id = res[cnt].id;
                testType.acronym = res[cnt].Acronym;
                testType.testName = res[cnt]['Test Name'];
                this.parentTestTypeModel.push(testType);
            }
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
        });
    }

    getTestType() {
        this.getDloList('71/11').subscribe((res: any) => {
            this.testTypeModel = res;

            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);

        });
    }

    getRaterType() {
        this.getDloList('72/' + this.countryId).subscribe((res: any) => {
            this.raterTypeModel = res;
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
        });
    }
    getTestPlatForm() {
        this.getDloList('73/' + this.countryId).subscribe((res: any) => {
            this.testFlatFormModel = res;
            setTimeout(function () {
                $('select[id=\'selectpicker\']').selectpicker('refresh');
            }
                , 500);
        });
    }

    setDockControlsForSave() {
        this.dock.dockControls = [];
        this.dock.backgroundcolor = '#343a40';
        this.addButtonToList(buttonconstants.Save, true);
        this.addButtonToList(buttonconstants.Cancel, true);
    }

    getparent_data_col_var_opt_id() {
        this.parent_data_col_var_opt_id = [];
        this.apicall.get(ApiEndpoints.getdetails, '66/' + this.countryId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.parent_data_col_var_opt_id = res.json().Data;
                } else {
                    this.errorComponent.handleError(res.json().error_description);
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

    deleteTemplate() {
        const selectedRows = $('input[name=\'chkSelect\']:checked');

        if (this.id.length == 0) {
            this.errorComponent.handleCustomError(MessageComponent.error_selectfordelete);
        } else {
            if (confirm(MessageComponent.msg_confirm)) {
                let deletedCount = 0;
                // // this.loader.loading = true;
                for (let cnt = 0; cnt < this.selectedData.length; cnt++) {
                    this.deleteRecordById(this.selectedData[cnt]['id']).subscribe(res => {

                        if (res) {
                            deletedCount += 1;
                        }

                        if (deletedCount == this.selectedData.length) {
                            this.isComponentloaded = false;
                            this.selectedData = [];
                            this.id = null;
                            this.getTemplateData();
                            this.snackBar.open(MessageComponent.msg_deletesuccess, 'Success', {
                                duration: 2000,
                            });
                            // // this.loader.loading = false;
                        }
                    });
                }
            }
        }
    }

    deleteRecordById(selectedData: string): Observable<any> {
        return this.apicall.delete(ApiEndpoints.deleteTest + selectedData, null).map(
            res => {
                if (res.status != '200') {
                    this.errorComponent.handleError(res.json().error_description);
                }
                return true;
            },
            err => {
                this.errorComponent.handleError(err);
                return false;
            });
    }

    saveTemplateData() {
        if (!this.isComponentloaded) {
            return false;
        }

        this.pageSubmit = true;
        if (this.listFormGroup.valid) {
            // // this.loader.loading = true;
            const saveURL = ApiEndpoints.saveTest;
            this.testModel = this.listFormGroup.value;
            if(this.testModel.published == null) {
                this.testModel.published = false;
            }
            this.testModel.countryId = this.countryId;
            if (this.testModel.testId != null && this.testModel.testId > 0) {
                this.updateTestData();
            } else {
                this.testModel.testId = 0;

                this.apicall.post(saveURL, this.testModel).subscribe(
                    res => {
                        // // this.loader.loading = false;
                        if (res.status == '201') {
                            this.snackBar.open(MessageComponent.msg_savesuccess, 'Success', {
                                duration: 2000,
                            });
                            this.getTemplateData();
                            this.cancelEvent();
                            this.setDockControls();

                        } else {
                            this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                            // this.errorComponent.handleError(err);
                        }
                    },

                    err => {
                        // this.loader.loading = false;
                        this.errorComponent.handleError(err);
                    });
            }
        }
    }

    updateTestData() {
        this.apicall.put(ApiEndpoints.updateTest, this.testModel).subscribe(
            res => {
                // // this.loader.loading = false;
                if (res.status == '200') {
                    this.snackBar.open(MessageComponent.msg_updatesuccess, 'Success', {
                        duration: 2000,
                    });

                    this.getTemplateData();
                    this.cancelEvent();
                    this.setDockControls();
                } else {
                    this.errorComponent.handleCustomError(MessageComponent.msg_savefail);
                }
            },
            err => {
                // // this.loader.loading = false;
                this.errorComponent.handleError(err);
            });
    }

    loadEmptyTemplate() {
        if (this.id != null && this.id != '' && this.id > 0) {
            this.getSavedData(this.id);
        } else {
            this.testModel = new TestModel();
            this.listFormGroup.reset();

        }


        this.toggleClick(1);
        this.isComponentloaded = true;
        this.setDockControlsForSave();
    }

    getTemplateData() {

        //  this.loader.loading = true;

        this.apicall.get(ApiEndpoints.getdetails, '5/' + this.countryId).subscribe(
            res => {
                if (res.json().ack == 'success') {
                    this.details = res.json();
                    const time1 = new Date();
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

    getDloList(param: any): Observable<any> {
        return this.apicall.get(ApiEndpoints.getdetails, param).map(
            res => {
                if (res.json().ack == 'success') {
                    return res.json().Data;
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


    toggleClick(flag: number) {
        $('#divTest').toggle(500);
        $('#divTable').toggle(500);

        if (flag == 1) {
            this.id = null;
        }
    }

}
