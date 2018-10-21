import { Injectable, Component, OnInit, NgZone, Injector } from '@angular/core';
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
import { AuthGuard } from './authGuard.service';
import { TimerComponent } from '../shared/timer.component';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ApiCallComponent implements OnInit {
    headers: any;
    options: any;
    API_ENDPOINT: any;
    AppClientId: string;
    UserTitleId: any;
    constructor(private http: Http,
        private userInfo: UserInfoComponent,
        private router: Router,
        private authGuard: AuthGuard,
        public timer: TimerComponent,
        public zone: NgZone,
        public _route: Router,
        public _snackBar: MatSnackBar
    ) {

    }
    ngOnInit() {

    }

    setHeaders() {
        this.timer.resetTime();
        this.headers = new Headers({
            'Content-Type': 'application/json',
        });
        // this.headers.append("Authorization", "bearer " + this.userInfo.getAccessToken());
        this.headers.append('Authorization', 'bearer ' + this.userInfo.getAccessToken());
    }
    public login(url: any, username: string, password: string) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
        });
        this.headers.append('Authorization', ApiEndpoints.getAuthorization);
        // try {
        url = url + 'username=' + btoa(username) + '&password=' + btoa(password);
        return this.http.post(url, null, {
            headers: this.headers
        })
            .map(this.extractData)
            .catch(this.handleErrorPromise);
    }

    public get(url: any, param: any) {
        this.setHeaders();
        // try {
        if (param !== null) {
            url = url + param;
        }
        return this.http.get(url, {
            headers: this.headers
        })
            .map(response => this.extractData(response))
            .catch(error => this.handleErrorPromise(error));
    }

    public post(url: any, param: any) {
        this.setHeaders();
        return this.http.post(url, param, {
            headers: this.headers
        })
            .map(response => this.extractData(response))
            .catch(error => this.handleErrorObservable(error));

    }

    public put(url: any, param: any) {
        this.setHeaders();
        return this.http.put(url, param, {
            headers: this.headers
        })
            .map(response => this.extractData(response))
            .catch(error => this.handleErrorObservable(error));

    }

    public delete(url: any, param: any) {
        this.setHeaders();
        return this.http.delete(url, {
            headers: this.headers
        })
            .map(response => this.extractData(response))
            .catch(error => this.handleErrorObservable(error));

    }

    private extractData(res: Response) {
        return res;
    }

    private handleErrorObservable(error: Response | any) {
        const errMsg = this.handleErrorCases(error);
        if (errMsg.status === 401) {
            this._route.navigate(['login']);
        }
        this._snackBar.open(errMsg.msg, '', {
            duration: 1000
        });
        return Observable.throw(errMsg);
    }

    private handleErrorPromise(error: Response) {
        const errMsg = this.handleErrorCases(error);
        if (errMsg.status === 401) {
            this._route.navigate(['login']);
        }
        this._snackBar.open(errMsg.msg, '', {
            duration: 1000
        });
        return Promise.reject(errMsg);
    }
    private handleErrorCases(err: Response) {
        const error = {
            status: -1,
            msg: ''
        };
        switch (err.status) {
            case 401:
                error.status = 401;
                error.msg = 'Invalid Access Token';
                break;
            case 404:
                error.status = 404;
                error.msg = 'Resource Not Found';
                break;
            case 409:
                error.status = 409;
                if (err.url.indexOf('createuser') !== -1) {
                    error.msg = 'Username is already being used.';
                } else {
                    error.msg = 'Resource Conflict';
                }
                break;
            case 500:
                error.status = 500;
                error.msg = 'Something went wrong!';
                break;
            default:
                error.status = -1;
                error.msg = 'Unknown Error!';
        }
        return error;
    }
}
