import { Component, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
// import { ObjectOrderrByPipe } from '../objectorderrbypipe';
import { UserInfoComponent } from '../../../shared/userinfo.component';
import { Dock, DockControl, KeyValuePair } from '../dock.controls';
import { SortModel } from '../../model/sort.model';
import { Location } from '@angular/common';

declare var $: any;

@Component({
    selector: 'dynamic-table',
    templateUrl: 'dynamic-table.component.html',
    styleUrls: ['dynamic-table.component.scss'],
    outputs: ['onTableEvent'],
})
export class DynamicTableComponent {
    @Input() details: any;
    @Input() key: any;
    @Input() notes: any;
    @Input() multiselect: boolean;
    public selectedItems: any[];
    // @Input() selection: boolean;
    public onTableEvent = new EventEmitter();
    headerColumns: any[];
    usersList: any[];
    pageSize: number;
    pageIndex: number;
    totalRecords = 0;
    allRecords: number;
    selectedIndex: number;
    sortColumn: string;
    searchText: string;
    direction: number;
    isDesc = false;
    dataFiltered: boolean;
    headerSelected: boolean;
    pageIndexList: any[];
    id: any;
    dock: Dock;

    dockControl: DockControl;
    dloList: KeyValuePair[];
    selectedId: string;
    table: any;

    constructor(private userInfo: UserInfoComponent, public snackBar: MatSnackBar, public _location: Location) {
        this.id = null;
        this.dockControl = new DockControl();
        this.dock = new Dock();
        this.dloList = [];
        this.pageIndexList = [];
        this.headerColumns = [];
        this.pageSize = 100;
        this.pageIndex = 1;
        this.usersList = [];
        //this.setDockControls();

    }
    ngOnChanges(changes: SimpleChanges) {
        this.selectedIndex = -1;
        this.headerSelected = false;
        this.searchText = '';
        this.pageIndex = 1;
        if (changes.details.currentValue != false) {
            this.sortColumn = "";
            this.applyChanges();
        } else {
            this.usersList = [];
            // $("#example").remove();
            // $('#example_wrapper').remove();
            //   $('#example').DataTable().destroy();
        }
    }

    applyChanges() {
        this.id = 0;
        if (this.details == null) {
            return false;
        }

        // var table = $('#example').DataTable({
        //     // orderCellsTop: false,
        //     "scrollX": true,
        //     "colReorder": true,
        //     "bDestroy": true,
        //     "bScrollCollapse": true,
        //     "bJQueryUI": false,
        //     "bPaginate": false,
        //     "sScrollY": "50vh",
        //     "bInfo": false,
        //     "bFilter": false,
        //     "bSort": false,
        // });
        // table.destroy();
        $('input[id=\'txtColSearch\']').val('');
        console.log(this._location.path());
        if (this._location.path() == '/home/account/userList') {
            this.allRecords = this.details.length;
            console.log('Records count = ' + this.details.length);
        } else {
            this.allRecords = this.details.Data.length;
            console.log('Records count = ' + this.details.Data.length);
        }


        this.pageSizeChange();

        // $('#example').DataTable().destroy();;

        if (this.headerColumns.length == 0) {
            const dynamicColumns = [];
            let i = 0;
            $.each(this.dataCols(), function (key, value) {
                const obj = { sTitle: key, sort: 0 };
                dynamicColumns[i] = obj;
                i++;
            });
            this.headerColumns = dynamicColumns;
        }
        this.headerSelected = false;
        this.selectedIndex = -1;
        // this.loadJsonData();
    }

    pageSizeChange() {
        this.usersList = [];
        if (this._location.path() == '/home/account/userList') {
            const data = this.details.slice(0, this.pageSize);
            for (const i in data) {
                data[i].selectedRow = false;
            }
            this.usersList = data;
        } else {
            const data = this.details.Data.slice(0, this.pageSize);
            for (const i in data) {
                data[i].selectedRow = false;
            }
            this.usersList = this.details.Data.slice(0, this.pageSize);
        }

        this.totalRecords = this.usersList.length;
        this.getPageIndexArray();
    }

    sort(item) {
        this.isDesc = !this.isDesc; //change the direction
        this.sortColumn = item.sTitle;
        const direction = this.isDesc ? 1 : -1;
        this.headerColumns.forEach(element => {
            if (item.sTitle == element.sTitle) {
                element.sort = element.sort == 1 ? -1 : 1;
                item.sort = element.sort;
            } else {
                element.sort = 0;
            }

        });

        const args: SortModel = new SortModel();
        args.property = item.sTitle;
        args.direction = item.sort;
        const data = this.details.Data;
        for (const i in data) {
            data[i].selectedRow = false;
        }
        this.usersList = this.transform(data, args);
        // this.usersList = this.objectOrderrByPipe.transform(this.details.Data, args);
        this.usersList = this.usersList.slice(0, this.pageSize);

        this.getPageIndexArray();
    }

    getPageIndexArray() {
        // this.pageIndex = 1;
        this.pageIndexList = [];
        const maxIndex = Math.ceil(this.dataLength() / this.pageSize);
        for (let cnt = 1; cnt <= maxIndex; cnt++) {
            this.pageIndexList.push(cnt);
        }

        if (this.pageIndexList.length == 0) {
            this.pageIndexList.push(1);
        }
    }

    pageIndexChangeByButton(type: string) {
      
        this.selectedIndex = -1;
        this.headerSelected = false;
        switch (type) {
            case 'pre': {
                if (this.pageIndex > 1) {
                    this.pageIndex -= this.pageIndex > 1 ? 1 : 0;
                    this.pageIndexChange();
                }
                break;
            }
            case 'next': {
                this.pageIndex += this.pageIndexList[this.pageIndexList.length - 1] > this.pageIndex ? 1 : 0;
                this.pageIndexChange();
                break;
            }
            case 'last': {
                this.pageIndex = this.pageIndexList[this.pageIndexList.length - 1];
                this.pageIndexChange();
                break;
            }
            default: {
                if (this.pageIndex > 1) {
                    this.pageIndex = 1;
                    this.pageIndexChange();
                }
                break;
            }
        }

    }

    transform(records: Array<any>, args?: any): any {
        return records.sort(function (a, b) {
            a[args.property] = a[args.property] == null ? '' : a[args.property];
            b[args.property] = b[args.property] == null ? '' : b[args.property];
            if (a[args.property].toString().toLowerCase() < b[args.property].toString().toLowerCase()) {
                return -1 * args.direction;
            } else if (a[args.property].toString().toLowerCase() > b[args.property].toString().toLowerCase()) {
                return 1 * args.direction;
            } else {
                return 0;
            }
        });
    }

    pageIndexChange() {
        if (this.sortColumn != '' && this.sortColumn != null) {
            const args: SortModel = new SortModel();
            this.headerColumns.forEach(element => {
                if (this.sortColumn == element.sTitle) {
                    args.property = element.sTitle;
                    args.direction = element.sort;
                    this.sort(element);
                }
            });
            const data = this.dataSource();
            for (const i in data) {
                data[i].selectedRow = false;
            }
            this.usersList = this.transform(data, args);
            // this.usersList = this.objectOrderrByPipe.transform(this.details.Data, args);

            const startIndex = this.pageIndex * this.pageSize - this.pageSize;
            const endIndex = this.pageIndex * this.pageSize;
            this.usersList = this.usersList.slice(startIndex, endIndex);
        } else if (this.searchText != '' && this.searchText != null) {
            this.onSearchChange(this.searchText);
        } else {
            const startIndex = this.pageIndex * this.pageSize - this.pageSize;
            const endIndex = this.pageIndex * this.pageSize;
            const data = this.dataSource();
            for (const i in data) {
                data[i].selectedRow = false;
            }
            this.usersList = data.slice(startIndex, endIndex);
        }

    }

    onSearchChange(searchText: string) {
        this.headerSelected = false;
        this.selectedIndex = -1;


        this.dataFiltered = searchText == '' ? false : true;
        this.searchText = searchText;
        this.clearSelectedRow();
        $('#example').find('tr').removeClass('selected');
        let resultData = [];
        this.usersList = [];
        if (searchText != '') {
            this.dataSource().forEach((element, index) => {
                for (const column of this.headerColumns) {
                    if (element[column.sTitle] != null && element[column.sTitle] != '') {
                        if (element[column.sTitle].toString().toLowerCase().search(searchText.toLowerCase()) >= 0) {
                            resultData.push(element);
                            break;
                        }
                    }
                }
            });
        } else {
            resultData = this.dataSource();
        }

        const lstSeatrchTxt = $('input[id=\'txtColSearch\']');
        for (let cnt = 0; cnt < lstSeatrchTxt.length; cnt++) {
            const _searchText = lstSeatrchTxt.eq(cnt).val();
            const _column = lstSeatrchTxt.eq(cnt).attr('column');
            if (lstSeatrchTxt.eq(cnt).val() != '') {
                this.dataFiltered = true;
                resultData = this.searchByColumn(_searchText, _column, resultData);
            }
        }

        for (const i in resultData) {
            resultData[i].selectedRow = false;
        }
        this.usersList = resultData.slice(this.pageIndex * this.pageSize - this.pageSize, this.pageIndex * this.pageSize);
        $('#example').find('tr').removeClass('selected');
        this.pageIndexList = [];

        let maxIndex = Math.ceil(resultData.length / this.pageSize);
        if (searchText == '') {
            maxIndex = Math.ceil(this.dataLength() / this.pageSize);
        }
        for (let cnt = 1; cnt <= maxIndex; cnt++) {
            this.pageIndexList.push(cnt);
        }

        if (this.pageIndexList.length == 0) {
            this.pageIndexList.push(1);
        }
        this.totalRecords = resultData.length;
    }



    onSearchChangeByColumn(searchText, column) {
        this.pageIndex = 1;
        this.dataFiltered = searchText == '' ? false : true;
        this.clearSelectedRow();
        $('#example').find('tr').removeClass('selected');
        let resultData = [];
        this.usersList = [];
        resultData = this.searchByColumn(searchText, column.sTitle, this.dataSource());

        const lstSeatrchTxt = $('input[id=\'txtColSearch\']');
        for (let cnt = 0; cnt < lstSeatrchTxt.length; cnt++) {
            const _searchText = lstSeatrchTxt.eq(cnt).val();
            const _column = lstSeatrchTxt.eq(cnt).attr('column');
            if (lstSeatrchTxt.eq(cnt).val() != '') {
                this.dataFiltered = true;
                resultData = this.searchByColumn(_searchText, _column, resultData);
            }
        }

        if ($('#txtSearch').val() != '') {
            this.dataFiltered = true;
            this.onSearchChange($('#txtSearch').val());
        } else {
            const data = resultData;
            for (const i in resultData) {
                resultData[i].selectedRow = false;
            }

            this.usersList = resultData.slice(this.pageIndex * this.pageSize - this.pageSize, this.pageIndex * this.pageSize);

            this.pageIndexList = [];
            let maxIndex = Math.ceil(resultData.length / this.pageSize);
            if (searchText == '') {
                maxIndex = Math.ceil(resultData.length / this.pageSize);
            }
            for (let cnt = 1; cnt <= maxIndex; cnt++) {
                this.pageIndexList.push(cnt);
            }


            if (this.pageIndexList.length == 0) {
                this.pageIndexList.push(1);
            }

            this.totalRecords = resultData.length;
        }
        $('#example').find('tr').removeClass('selected');

        //this.getPageIndexArray();
        //this.totalRecords = resultData.length;
    }

    searchByColumn(searchText, title, data): any[] {

        let resultData = [];
        this.usersList = [];
        if (searchText == '' || searchText == null) {
            resultData = data;
        } else {
            data.forEach((element, index) => {
                if (element[title] != null) {
                    if (element[title].toString().toLowerCase().search(searchText.toLowerCase()) >= 0 || searchText == '') {
                        resultData.push(element);
                    }
                }
            });
        }
        return resultData;
    }

    clearSelectedRow() {

        this.selectedId = null;
        this.selectedIndex = -1;
        this.id = '';
        // $("#example").DataTable();
    }

    getSelectedRowAll() {
        this.headerSelected = !(this.headerSelected);
        // this.id = "";
        // this.selectedIndex = -1;
        // this.selectedId = null;
        // $("#example").find("input:checkbox").prop("checked", $("#chkAllSelect").prop("checked"));
        // var eventInfo = "headerselected";
        // var value = this.usersList;
        // this.onTableEvent.emit({ eventInfo, value });
        if (this.multiselect == true) {
            if (this.headerSelected == true) {
                const value = [];
                for (const i in this.usersList) {
                    this.usersList[i].selectedRow = true;
                    value.push(this.usersList[i]);
                }
                const eventInfo = 'rowSelected';
                this.onTableEvent.emit({ eventInfo, value });
            } else {
                for (const i in this.usersList) {
                    this.usersList[i].selectedRow = false;
                }
                const value = [];
                const eventInfo = 'rowSelected';
                this.onTableEvent.emit({ eventInfo, value });
            }

        }
    }

    getSelectedRow(rowIndex, selectedRow: any) {
        this.usersList[rowIndex].selectedRow = !(this.usersList[rowIndex].selectedRow);
        if (this.multiselect == true) {
            const value = [];
            for (const i in this.usersList) {
                if (this.usersList[i].selectedRow == true) {
                    value.push(this.usersList[i]);
                }
            }
            const eventInfo = 'rowSelected';
            this.onTableEvent.emit({ eventInfo, value });

        } else {
            for (const i in this.usersList) {
                if (i != rowIndex) {
                    this.usersList[i].selectedRow = false;
                }
            }
            const eventInfo = 'rowSelected';
            let value = [];
            if (this.usersList[rowIndex].selectedRow == true) {
            value = [this.usersList[rowIndex]];
            } else {
            value = [];
            }
            this.onTableEvent.emit({ eventInfo, value });
        }

    }

    selectUser(row: any) {

        this.selectedId = row.memberId;
        // this.pageInfo.controls['id'].setValue(this.selectedId);
    }


    loadJsonData() {
        // // $("#example").remove();
        // // $('#example_wrapper').remove();
        // // $('#example').DataTable().destroy();
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

            this.table = $('#example').DataTable({
                // orderCellsTop: false,
                'scrollX': true,
                'colReorder': true,
                'bDestroy': true,
                'bScrollCollapse': true,
                'bJQueryUI': false,
                'bPaginate': false,
                'sScrollY': '50vh',
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
        }, 500);


    }
    titelizeKeys(key: string) {
        return key.replace(/_/g, ' ').toUpperCase();
    }
    dataLength() {
        if (this._location.path() == '/home/account/userList') {
            return this.details.length;
        } else {
            return this.details.Data.length;
        }
    }
    dataCols() {
        if (this._location.path() == '/home/account/userList') {
            return this.details[0];
        } else {
            return this.details.Data[0];
        }
    }
    dataSource() {
        if (this._location.path() == '/home/account/userList') {
            return this.details;
        } else {
            return this.details.Data;
        }
    }

}
