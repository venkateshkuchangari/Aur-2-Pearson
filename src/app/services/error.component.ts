import { Injectable, Component, OnInit } from '@angular/core';
import { Http, Response, JsonpModule, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiEndpoints } from './apiendpoints';
import { UserInfoComponent } from '../shared/userinfo.component';
import 'rxjs/Rx';
import { debug } from 'util';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorComponent implements OnInit {
    constructor(private http: Http, private userInfo: UserInfoComponent
        , private router: Router, public snackBar: MatSnackBar
    ) {
    }
    ngOnInit() {
    }

    handleError(error: any) {
        if (error.status == 401) {
            this.userInfo.clearAllSessions();
            this.router.navigate(['/login']);
        } else {
            let errMsg: string;
            if (error instanceof Response) {
                const body = error.json() || '';
                const err =  body.error || body;
                errMsg = err;
            }
            //  else {
            //     errMsg = error.message ? error.message : error.toString();
            // }
            this.snackBar.open(errMsg, error.msg, {
                duration: 2000,
            });
        }
    }

    handleCustomError(error: string) {
        this.snackBar.open(error, 'Error', {
            duration: 2000,
        });
    }

    handleSuccess(msg: string) {
        this.snackBar.open(msg, 'Success', {
            duration: 2000,
        });
    }
}
