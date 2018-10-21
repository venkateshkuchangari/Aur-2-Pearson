import { Component, ViewContainerRef, OnInit, Input, EventEmitter, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { DockControl, Dock } from '../dock.controls';
import { TranslateService } from '@ngx-translate/core';
import { isComponentView } from '@angular/core/src/view/util';
import * as buttonconstants from '../app.buttonconstants';
import { UserInfoComponent } from '../../../shared/userinfo.component';

declare var $: any ;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'simple-dock',
    templateUrl: 'simple-dock.component.html',
    styleUrls: ['simple-dock.component.scss'],
    // tslint:disable-next-line:use-output-property-decorator
    outputs: ['onDocEvent'],
})

export class SimpleDockComponent {
    @Input() dock: Dock;
    @Input() isComponentLoaded: boolean;
    @Input() isRowSelected: boolean;
    @Input() callApplyChanges: boolean;
    draggableEnabled: boolean;
    public onDocEvent = new EventEmitter();
    showVertical: boolean;

    constructor(private translate: TranslateService, public snackBar: MatSnackBar, public _userInfo: UserInfoComponent) {
        this.draggableEnabled = false;
        // this.translate.use("en");
    }

     // ngOnChanges(changes: { dock: Dock }) {
        // tslint:disable-next-line:use-life-cycle-interface
        ngOnChanges(changes: SimpleChanges) {
            console.log('isRowSelected=' + this.isRowSelected);
            console.log('isComponentLoaded=' + this.isComponentLoaded);
            /*  */
            if (!this.callApplyChanges) {
            /*  */
            this.applyChanges();
            }
        }
        // ngOnChanges(changes: {dock: SimpleChange}) {
        //     // console.log('onChanges - person = ', changes['dock'].currentValue);
        //   }
        // tslint:disable-next-line:use-life-cycle-interface
        ngOnInit() {
            // this.dock.backgroundcolor = "#343a40";
            if (this._userInfo.getUserPreferences() !== '') {
                this.dock.backgroundcolor = this._userInfo.getUserPreferences().hexColorId;
                } else {
                this.dock.backgroundcolor = '#343a40';
            }
            /*  */
            /* console.log(JSON.stringify(this.dock)); */
            /*  */
        }

        applyChanges() {
            this.dock.backgroundcolor = '#343a40';
            if (this.isRowSelected) {
                this.dock.dockControls.forEach(element => {
                    if (element.label === buttonconstants.Save) {
                        element.enable = false;
                    } else {
                        element.enable = true;
                    }
                });
            }
            // else {
            //     this.setDefaultButtons();
            // }

            if (this.isComponentLoaded) {
                this.dock.dockControls.forEach(element => {
                    if (element.label === buttonconstants.AddorEdit) {
                       // element.enable = false;
                    } else if (element.label === buttonconstants.Delete) {
                        if (this.isRowSelected) {
                            element.enable = true;
                        } else {
                            element.enable = false;
                        }
                    } else {
                        element.enable = true;
                    }
                });
            }
        }

        setDefaultButtons() {
            this.dock.dockControls.forEach(element => {
                if (element.label === buttonconstants.Refresh || element.label === buttonconstants.AddorEdit) {
                    element.enable = true;
                } else {
                    element.enable = false;
                }
            });
        }

        sendParentEvent(eventInfo: any, value: any) {
            // if (eventInfo == buttonconstants.AddorEdit && this.isComponentLoaded) {
            //     return false;
            // }

            if (eventInfo === buttonconstants.Save && !this.isComponentLoaded) {
                this.snackBar.open('Component not loaded', 'Error', {
                    duration: 2000,
                });
                return false;
            }
            this.onDocEvent.emit({eventInfo, value});
        }
    }
