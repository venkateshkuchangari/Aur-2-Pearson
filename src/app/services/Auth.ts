import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import { UserApi } from './api/UserApi';

const STORAGE_KEY = 'authorizationData';
const EXPIRES_KEY = 'expireTime';
const SOURCE = '';
@Injectable()
export class Auth {

  static AUTH_STRATEGIES = [
    'builtin'
  ];
  private static authObservable: any;
  loginObserv: any;
  currentUser: string;
  // httpConfigService: HTTPConfigService;
  AuthPath = 'auth';


  constructor(private http: Http
    // , private userApi: UserApi
) {
  }

  showLogin(): Observable<any> {
    const storageToken = sessionStorage.getItem('access_token');

    return Observable.create(observer => {
      observer.next(storageToken ? JSON.parse(storageToken) : undefined);
      observer.complete();
    });
  }

  loggedIn(): boolean {

    return sessionStorage.getItem('access_token') != null;
  }

  logout() {
    window.sessionStorage.clear();
  }

  clearToken() {
    this.logout();
  }

  createUuid(): string {
    const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    const chars = CHARS;
    const uuid = [];
    const radix = chars.length;

    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }

    return uuid.join('');
  }

  authenticate(loginInfo) {
    const accessKey = this.createUuid();
    console.log(loginInfo);
    //   Auth.authObservable  = this.userApi.loginUser(loginInfo.name, loginInfo.password).map((response: Response) => {
    //       this.updateSecurity(response, accessKey);
    //   });
      return Auth.authObservable;
  }

  getUser() {
    const currentUserData: any = JSON.parse( sessionStorage.getItem('access_token') );
    console.log(currentUserData);
    return currentUserData;
  }

  updateSecurity(response: Response, accessKey?: string) {
    const json = response.json();

    json[EXPIRES_KEY] = (new Date().getTime() + Number(60) * 1000);

    sessionStorage.setItem('access_token', JSON.stringify(json));
    if (accessKey) {
      localStorage.setItem('accessKey', JSON.stringify(accessKey));
    }
    return json;
  }

  hasTokenExpired() {
    let expires = true;

    const storageToken = sessionStorage.getItem('access_token');

    if (storageToken) {
      const tokenObj = JSON.parse(storageToken);
      const expiresTime = Number(tokenObj[EXPIRES_KEY]);

      if (expiresTime) {
        const currentTime = new Date().getTime();

        if (currentTime < expiresTime) {
          expires = false;
        }
      }
    }
    return expires;
  }
}
