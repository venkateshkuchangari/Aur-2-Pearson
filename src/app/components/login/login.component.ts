import { Component } from '@angular/core';
import { ApiEndpoints } from '../../services/apiendpoints';
import { ApiCallComponent } from '../../services/apicall.component';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoComponent } from '../../shared/userinfo.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  username: string;
  password: string;
  private colorList: any[];
  constructor(private router: Router
    // , private auth: Auth
    , private apicall: ApiCallComponent, private userInfo: UserInfoComponent
    , public snackBar: MatSnackBar
    , private translate: TranslateService, public _service: LoginService
  ) {
    // (window as any).doSomething = (username, password) => {
    //   this.username = username;
    //   this.password = password;
    //   this.auth.authenticate({ name: this.username, password: this.password }).subscribe(
    //     (resp) => {
    //       (window as any).location = 'home';
    //     }
    //   );
    // };
    this.translate.use('en');
  }

  /* login() {
    // this.auth.authenticate({ name: this.username, password: this.password }).subscribe(
    //   (resp) => {
    //     this.router.navigateByUrl('home');
    //   });
    console.log("login");
    this.apicall.login(ApiEndpoints.login, this.username, this.password).subscribe(
      res => {
        if (res.json().access_token != null) {
          var result = res.json();
          this.userInfo.setAccessToken(result.access_token);
          this.userInfo.setUserName(this.username);
          this.userInfo.setTimeput(result.expires_in);
          Observable.combineLatest(
            this._service.fetchUserDetails(this.username),
            this._service.fetchColorList()
            ).subscribe(data=>{
            this.userInfo.setUserPreferences(JSON.stringify(data[0].json().frUserPreferenceRequest));
            this.colorList=data[1].json().Data;
            console.log(data[0].json().frUserPreferenceRequest.hexColorId);
            for(let i in this.colorList){
            if(parseInt(this.colorList[i].lkp_lookup_value_id)==parseInt(data[0].json().frUserPreferenceRequest.hexColorId)){
            let tmpColour=data[0].json().frUserPreferenceRequest;
            tmpColour.hexColorId=this.colorList[i].hexcolorvalue
            this.userInfo.setUserPreferences(JSON.stringify(tmpColour));
            break;
            }
            }
            this.router.navigateByUrl('home');
            });
          // this.userInfo.setTimeput(100);

         // this.router.navigateByUrl('home');
        }
        else {
          this.snackBar.open(res.json().error, 'Error', {
            duration: 2000,
          });
        }
      },
      err => {
        this.snackBar.open(err, 'Error', {
          duration: 2000,
        });
      });
  } */

  login() {
    // this.auth.authenticate({ name: this.username, password: this.password }).subscribe(
    //   (resp) => {
    //     this.router.navigateByUrl('home');
    //   });
    console.log('login');
    this.apicall.login(ApiEndpoints.login, this.username, this.password).subscribe(
      res => {
        if (res.json().access_token != null) {
          const result = res.json();
          this.userInfo.setAccessToken(result.access_token);
          this.userInfo.setUserName(this.username);
          this.userInfo.setTimeput(result.expires_in);
          Observable.combineLatest(
            this._service.fetchUserDetails(this.username),
            this._service.fetchColorList(),
            this._service.fetchModuleList(this.username),
            this._service.roleList()
            ).subscribe(data => {
            // this.userInfo.setUserId(data[0].json().userId);
            this.userInfo.setUserPreferences(JSON.stringify(data[0].json().frUserPreferenceRequest));
            sessionStorage.setItem('roles', JSON.stringify(data[0].json().frUserRoleRequest));
            this.colorList = data[1].json().Data;
            console.log(data[0].json().frUserPreferenceRequest.hexColorId);
            for (const i in this.colorList) {
            // tslint:disable-next-line:radix
            if (parseInt(this.colorList[i].lkp_lookup_value_id) === parseInt(data[0].json().frUserPreferenceRequest.hexColorId)) {
            const tmpColour = data[0].json().frUserPreferenceRequest;
            tmpColour.hexColorId = this.colorList[i].hexcolorvalue;
            this.userInfo.setUserPreferences(JSON.stringify(tmpColour));
            break;
            }
            }

            console.log(data[2].json());
            sessionStorage.setItem('roleList', JSON.stringify(data[3].json()));
            for (const i in data[2].json().Data) {
              if (data[0].json().frUserPreferenceRequest.homeModuleId === data[2].json().Data[i].lkp_lookup_value_id) {
                switch (data[2].json().Data[i].value_description) {
                  case 'Account':
                    this.router.navigate(['home/account']);
                    // this.router.navigateByUrl('home/status');
                    break;
                  case 'Assignments':
                    this.router.navigate(['home/assignements']);
                    break;
                  case 'Incentive':
                    this.router.navigate(['home/incentive']);
                    break;
                  case 'Members':
                    this.router.navigate(['home/memebers']);
                    break;
                  case 'Messages':
                    this.router.navigate(['home/messages']);
                    break;
                  case 'Portal Management':
                    this.router.navigate(['home/portal']);
                    break;
                  case 'Setup':
                    this.router.navigate(['home/setup']);
                    break;
                }
              }
            }

            // this.router.navigateByUrl('home');
            });
          // this.userInfo.setTimeput(100);
// the below line need to comment otherwise when we logged into portal at the first time we aren't able too see the homepage then we need to refresh. So, Please comment this line

// this.router.navigateByUrl('home');
        } else {
          this.snackBar.open(res.json().error, 'Error', {
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
}
