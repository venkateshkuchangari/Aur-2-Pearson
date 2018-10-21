import { Component, Input, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { FarmModel } from '../../model/farm.model';
declare var $: any;
@Component({
    selector: 'dynamic-form',
    templateUrl: 'dynamic-form.component.html',
    styleUrls: ['dynamic-form.component.scss'],
    providers: [DatePipe]
})

export class DynamicFormComponent {
    @Input() dataObject;
    @Input() dataObject1;
    form: FormGroup;
    form1: FormGroup;
    objectProps;
    objectProps1;
    pageSubmit: boolean;
    maxDate: any;
    minDate: any;
    dateValidationMsg: string;

    constructor(private datePipe: DatePipe, private userInfo: UserInfoComponent) {
        this.form = new FormGroup({});
        this.pageSubmit = false;
        //  this.dataObject1 = this.dataObject;
        this.dateValidationMsg = '';
        const myDate = new Date();

        this.minDate = new Date(
          myDate.getFullYear(),
          myDate.getMonth() - 2,
          myDate.getDate()
        );

        this.maxDate = new Date(
          myDate.getFullYear(),
          myDate.getMonth() + 1,
          myDate.getDate()
        );
    }
    deleteRow(headerIndex, childIndex, value, key) {
        const result = this.form.controls[key].value;
        const output: any[] = [];
        for (const item of result) {
            if (item != value) {
                output.push(item);
            }
        }
        this.form.controls[key].setValue(output);

        // $("select[id='testmulti']").multiselect();
        // $("select[id='testmulti']").multiselect('deselect', value);
        // var chekLst = $(".multiselect-container").find(":checkbox");
        const chekLst = $('select[key=' + key + ']').parent().find(':checkbox');
        for (let cnt = 0; cnt < chekLst.length; cnt++) {
            // this.selectedRoles[this.selectedRoles.length].roleId = chekLst[cnt].value.split(":")[1].trim();
            if (chekLst[cnt].value.split(':')[1].trim() == value.toString()) {
                chekLst[cnt].checked = false;
                $(chekLst[cnt]).closest('li').attr('class', '');
            }
        }

    }

    checkValue(headerIndex, childIndex, value, key): boolean {
          const result = this.form.controls[key].value;
         // console.log("result="+result);
        // var result = this.objectProps[headerIndex].frUiTemplateDetailResponse[childIndex].value;
        const search = result.filter(a => a == value);
        if (search.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.dataObject.currentValue != null && changes.dataObject.currentValue.length > 0) {
            this.createFormGroup();
            this.pageSubmit = false;
            this.dateValidationMsg = '';


            const me = this;
            setTimeout(() => {
                $('select[id=\'selectpicker\']').selectpicker();

                $('select[id=\'testmulti\']').multiselect({
                    header: false,
                    noneSelectedText: 'Select',
                    enableFiltering: true,
                    enableCaseInsensitiveFiltering: true,
                    onChange: function (element, checked) {
                        const data = me.objectProps;
                        const headerIndex: number = Number($(element).attr('headerIndex'));
                        const childIndex: number = Number($(element).attr('childIndex'));

                        const lstDDL = $('select[id=\'testmulti\']'); //.eq(0).attr("placeholder")
                        for (let cnt = 0; cnt < lstDDL.length; cnt++) {
                            const placeholder = lstDDL.eq(cnt).attr('placeholder');
                            $('.multiselect-selected-text').eq(cnt).text(placeholder);
                        }
                        const chekLst = $('.multiselect-container').find(':checkbox:checked');
                        const selectedRoles = [];
                        for (let cnt = 0; cnt < chekLst.length; cnt++) {
                            const role: any[] = [];
                            const roleId = chekLst[cnt].value.split(':')[1].trim();
                            selectedRoles.push(roleId);
                        }
                        me.form.controls[$(element).attr('key')].setValue(selectedRoles);
                    }
                });
                const lstDDL = $('select[id=\'testmulti\']'); //.eq(0).attr("placeholder")
                for (let cnt = 0; cnt < lstDDL.length; cnt++) {
                    const placeholder = lstDDL.eq(cnt).attr('placeholder');
                    $('.multiselect-selected-text').eq(cnt).text(placeholder);
                }
            }, 500);
        }
    }


    date;

    ngOnInit() {



        this.date = new Date();

        // // // remap the API to be suitable for iterating over it
        // this.objectProps =
        //     Object.keys(this.dataObject)
        //         .map(prop => {
        //             return Object.assign({}, { key: prop }, this.dataObject[prop]);
        //         });
        // // setup the form
        // const formGroup = {};
        // for (let prop of Object.keys(this.dataObject)) {
        //     formGroup[prop] = new FormControl(this.dataObject[prop].value || '', this.mapValidators(this.dataObject[prop].validation));
        // }
        // this.form = new FormGroup(formGroup);

        //  this.createFormGroup();
    }

    private mapValidators(validators, columnName) {
        const formValidators = [];
        if (validators != null) {
            for (const validation of Object.keys(validators)) {
                if (validation === 'required') {
                    formValidators.push(Validators.required);
                } else if (validation === 'min') {
                    formValidators.push(Validators.minLength(validators[validation]));
                } else if (validation === 'max') {
                    formValidators.push(Validators.maxLength(validators[validation]));
                } else if (validation === 'pattern') {
                    formValidators.push(Validators.pattern(validators[validation]));
                }

            }
        }

        console.log('columnName=' + columnName);
                console.log('columnName=' + columnName.indexOf('email'));
                if (columnName.indexOf('email') >= 0) {
                     formValidators.push(Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'));
                }
        return formValidators;
    }

    toggle() {
    }

    public getDynamicFarmValue(): any {
        const result: FarmModel[] = [];
        const me = this;
        if (this.form.valid) {
            for (let header = 0; header < this.objectProps.length; header++) {
                for (let cnt = 0; cnt < this.objectProps[header].frUiTemplateDetailResponse.length; cnt++) {
                    const objData = this.objectProps[header].frUiTemplateDetailResponse[cnt];
                    const model: FarmModel = new FarmModel();
                    model.uiTemplateDetailId = objData.uiTemplateDetailId;
                    model.value = this.form.controls[objData.uiTemplateDetailId].value;
                    let value = this.form.controls[objData.uiTemplateDetailId].value;
                    const columnType = this.objectProps[header].frUiTemplateDetailResponse[cnt].uiColumnType;
                    const columnName = this.objectProps[header].frUiTemplateDetailResponse[cnt].uiColumnName;

                    this.objectProps[header].frUiTemplateDetailResponse[cnt].dloListId = null;
                    this.objectProps[header].frUiTemplateDetailResponse[cnt].uiControlValidation = null;
                    if (value != '' && columnType == 'date') {
                        value = this.datePipe.transform(model.value, 'MM/dd/yyyy');
                        this.objectProps[header].frUiTemplateDetailResponse[cnt].value = value;
                    } else if (value != '' && columnType == 'multi-select') {
                        const resultData = this.getValue(value);
                        this.objectProps[header].frUiTemplateDetailResponse[cnt].value = resultData;
                        // this.objectProps[header].frUiTemplateDetailResponse[cnt].dloListId = JSON.stringify(this.objectProps[header].frUiTemplateDetailResponse[cnt].dloListId);
                        // result.push(model);
                    } else if (value != '' && columnType == 'toggle') {
                        this.objectProps[header].frUiTemplateDetailResponse[cnt].value = value ? 'true' : 'false';
                    } else {
                        this.objectProps[header].frUiTemplateDetailResponse[cnt].value = value;
                    }

                    if (columnName == 'date of birth') {
                        const dateOne = new Date(this.datePipe.transform(model.value, 'yyyy/MM/dd')); //Year, Month, Date

                        const myDate = new Date();

                        const dateTwo = new Date(
                          myDate.getFullYear(),
                          myDate.getMonth(),
                          myDate.getDate()
                        );

                        if (dateTwo > dateOne) {
                            this.dateValidationMsg = '';
                         } else {
                             this.dateValidationMsg = 'Date of birth should be less than or equal to currnet date.';
                             this.pageSubmit = true;
                             return false;

                         }
                    }
                }


                // this.objectProps1.forEach(header => {
                //     header.frUiTemplateResponse.forEach(element => {
                //         let model: FarmModel = new FarmModel();

                //         model.uiTemplateDetailId = element.uiTemplateDetailId;
                //         model.value = this.form.get(element.key).value;
                //         result.push(model);
                //     });
                // });
            }
            return this.objectProps;
        } else {
            this.pageSubmit = true;
            return false;
        }
    }

    getValue(data: any[]): string {
        let returnData = '';
        for (const entry of data) {
            if (returnData == '') {
                returnData = entry;
            } else {
                returnData += ',' + entry;
            }
            console.log(entry); // 1, "string", false
        }
        return returnData;
    }

    // createFormGroup() {
    //     // // remap the API to be suitable for iterating over it
    //     this.objectProps1 =
    //         Object.keys(this.dataObject1)
    //             .map(prop => {
    //                 return Object.assign({}, { key: prop }, this.dataObject1[prop]);
    //             });
    //     // setup the form
    //     const formGroup1 = {};
    //     for (let prop of Object.keys(this.dataObject1)) {
    //         formGroup1[prop] = new FormControl(this.dataObject1[prop].value || '', this.mapValidators(this.dataObject1[prop].validations));
    //     }
    //     this.form1 = new FormGroup(formGroup1);
    // }

    createFormGroup2() {

        // if (this.privilegesFormArray != null) {
        //     while (this.privilegesFormArray.length !== 0) {
        //         this.privilegesFormArray.removeAt(0)
        //     }
        // }

        // // remap the API to be suitable for iterating over it
        this.objectProps =
            Object.keys(this.dataObject)
                .map(prop => {
                    return Object.assign({}, { key: prop }, this.dataObject[prop]);
                });
        // setup the form
        const formGroup = {};
        for (const prop of Object.keys(this.dataObject)) {
            // formGroup[prop] = new FormControl(this.dataObject[prop].value || '', this.mapValidators(this.dataObject[prop].validations));
        }
        this.form = new FormGroup(formGroup);

        // console.log("form="+this.form)
    }

    getObjProperties(data, value): any {
        const result =
            Object.keys(data)
                .map(prop => {
                    return Object.assign({}, { key: prop }, data[prop][value]);
                });

        return result;

    }

    createFormGroup() {

        // if (this.privilegesFormArray != null) {
        //     while (this.privilegesFormArray.length !== 0) {
        //         this.privilegesFormArray.removeAt(0)
        //     }
        // }

        // // remap the API to be suitable for iterating over it

        this.objectProps =
            Object.keys(this.dataObject)
                .map(prop => {
                    // return Object.assign({}, { key: this.dataObject1[prop].templateName }, this.dataObject1[prop]);
                    return Object.assign({}, { key: prop }, this.dataObject[prop]);
                });
        // setup the form
        const formGroup = {};
        for (const objHeader of Object.keys(this.dataObject)) {
            // for (let prop of Object.keys(this.dataObject[objHeader].frUiTemplateResponse)) {
            for (const prop of Object.keys(this.dataObject[objHeader].frUiTemplateDetailResponse)) {
                // formGroup1[prop] = new FormControl(this.dataObject1[prop].value || '', this.mapValidators(this.dataObject1[prop].validations));
                let dataValue: any = this.dataObject[objHeader].frUiTemplateDetailResponse[prop].value;
                const columnType = this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType;
                const columnName = this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName;
                if (columnType == 'date' && dataValue != null) {
                    dataValue = this.datePipe.transform(dataValue, 'yyyy-MM-dd');
                } else if (columnType == 'multi-select' || columnType == 'select') {
                    if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId != null && this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId != '') {
                        // this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId = JSON.parse(this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId);
                        // this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId = this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId);

                    } else {
                        this.dataObject[objHeader].frUiTemplateDetailResponse[prop].dloListId = [];
                    }

                    if (columnType == 'multi-select') {
                        if (dataValue != '' && dataValue != null) {

                            if (dataValue.search(',') >= 0) {
                                const tempValue = this.dataObject[objHeader].frUiTemplateDetailResponse[prop].value.split(',');
                                // dataValue = tempValue;
                                const arrayValue: any[] = [];
                                for (let index = 0; index < tempValue.length; index++) {
                                    arrayValue.push(parseInt(tempValue[index]));
                                }
                                dataValue = arrayValue;
                            } else {
                                dataValue = [parseInt(this.dataObject[objHeader].frUiTemplateDetailResponse[prop].value)];
                            }
                        } else {
                            dataValue = [];
                        }
                    }
                    // else if (dataValue != "" && dataValue != null) {
                    //     dataValue = parseInt(dataValue);
                    // }
                } else if (columnType == 'toggle' ) {
                    dataValue =  dataValue == 'true' ? true : false;
                }



                if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName == 'createdby') {
                    dataValue = this.userInfo.getUserName();
                      this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = 'label';
                      this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = dataValue;
                } else if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName == 'createdon') {
                    this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = 'label';
                } else if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName == 'calculatedage') {
                    this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = 'label';
                } else if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName == 'datedeleted') {
                    this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = 'label';
                } else if (this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnName == 'calculatedage') {
                    this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiColumnType = 'label';
                }
                formGroup[this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiTemplateDetailId] = new FormControl(dataValue || '', this.mapValidators(this.dataObject[objHeader].frUiTemplateDetailResponse[prop].uiControlValidation, columnName));
                // formGroup1["childControls"] = new FormGroup({createChildFormGroup(this.dataObject1[prop].frUiTemplateResponse)});
            }
        }
        this.form = new FormGroup(formGroup);
        // console.log("form="+this.form)

        // var form1 = new FormGroup({
        //     name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
        //     address: new FormGroup({
        //         street: new FormControl('', <any>Validators.required),
        //         postcode: new FormControl('8000')
        //     })
        // });

    }

    public createChildFormGroup(data): any {

        let childForm: FormGroup;

        const formGroupChild = {};
        for (const prop of Object.keys(data)) {
            // formGroup1[prop] = new FormControl(this.dataObject1[prop].value || '', this.mapValidators(this.dataObject1[prop].validations));
            // formGroupChild[prop] = new FormControl(data[prop].value || '', this.mapValidators(data[prop].validations,columnName));

        }
        childForm = new FormGroup(formGroupChild);

        return formGroupChild;
    }
}
