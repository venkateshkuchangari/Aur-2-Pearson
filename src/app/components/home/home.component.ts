import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/Auth';
import { ApiEndpoints } from '../../services/apiendpoints';
import { ApiCallComponent } from '../../services/apicall.component';
import { UserInfoComponent } from '../../shared/userinfo.component';
import { MatSnackBar } from '@angular/material';
import { TimerComponent } from '../../shared/timer.component';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
    title = 'app';
    collapseMenu: boolean;
    intervalId: any;
    refreshIntervalId: any;
    refreshTokenTime = 50000;
    public backGroundColor: Object;
    constructor(private apicall: ApiCallComponent, private userInfo: UserInfoComponent
        , private translate: TranslateService, private router: Router, private auth: Auth
        , public snackBar: MatSnackBar, public timer: TimerComponent
    ) {
        this.translate.use('en');
        this.collapseMenu = false;
        this.timer.resetTime();
    }


    gotoPage() {
        this.router.navigate(['./home/testpage']);
    }

    logout() {
        this.auth.logout();
        this.router.navigateByUrl('login');
    }

    portal() {
        this.router.navigate(['./portal']);
    }

    refresh(): void {
        window.location.reload();
    }

    navigatePage(path) {
        // document.location.href = path;
        this.router.navigateByUrl('candidatespage');
    }

    // refreshToken() {
    //     this.timer.resetTime();
    //     this.timer.showRefresh = false;
    //     this.getUserCountry();

    //     if (this.intervalId) {
    //         clearInterval(this.intervalId);
    //         this.expireToken();
    //       }
    // }

    expireToken() {
        this.intervalId = setInterval(() => {
            this.timer.timeout = this.timer.timeout - 1;
            if (this.timer.timeout <= 60 && this.timer.timeout > 0) {
                this.timer.showRefresh = true;
            } else if (this.timer.timeout <= 0) {
                this.timer.resetTime();
                this.timer.showRefresh = false;
                this.logout();
            }
        }, 1000);
    }

    refreshToken() {
        this.refreshIntervalId = setInterval(() => {
            const currentTime: number = new Date().getTime();
            console.log('refresh token= ' + this.timer.lastApiCallTime + ', current time=' + currentTime + ', diff=' + (currentTime - this.timer.lastApiCallTime));
            if ((currentTime - this.timer.lastApiCallTime) <= this.refreshTokenTime + 100) {
                console.log('calling refresh token');

                // this.apicall.login(ApiEndpoints.login, this.username, this.password).subscribe(
                //     res => {
                //     //   if (res.json().access_token != null) {
                //     //     var result = res.json();
                //     //     this.userInfo.setAccessToken(result.access_token);
                //     //     this.userInfo.setUserName(this.username);
                //     //     this.userInfo.setTimeput(result.expires_in);
                //     //     // this.userInfo.setTimeput(70);
                //     //     this.router.navigateByUrl('home');
                //     //   }
                //     //   else {
                //     //     this.snackBar.open(res.json().error, 'Error', {
                //     //       duration: 2000,
                //     //     });
                //     //   }
                //     },
                //     err => {
                //       this.snackBar.open(err, 'Error', {
                //         duration: 2000,
                //       });
                //     });
            } else {
                console.log('idle');
            }
        }, this.refreshTokenTime);
    }

    ngOnInit() {
        const bkgColor = this.userInfo.getUserPreferences().hexColorId;
       /*  if (bkgColor) {
            bkgColor = "#000";
        } */
        this.backGroundColor = { 'background-color': bkgColor };
        this.timer.lastApiCallTime = new Date().getTime();
        this.refreshToken();
        this.expireToken();
        this.getUserCountry();
        if (this.userInfo.getUserPreferences().autoHideMenu != null && this.userInfo.getUserPreferences().autoHideMenu !==  undefined)
        this.collapseMenu = this.userInfo.getUserPreferences().autoHideMenu;
        
    }


    getUserCountry() {
        this.apicall.get(ApiEndpoints.getcountryid, this.userInfo.getUserName()).subscribe(
            res => {
                const countryId = res.json().countryid;
                if (countryId == null || countryId === '' || countryId === '0') {
                    this.snackBar.open('User not associated to country', 'Error', {
                        duration: 5000,
                    });
                    this.router.navigate(['/login']);
                } else {
                    this.userInfo.setCountryId(res.json().countryid);
                }
            },
            err => {
                this.snackBar.open(err, 'Error', {
                    duration: 2000,
                });
            });
    }

}
