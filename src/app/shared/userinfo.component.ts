import { Injectable } from '@angular/core';

@Injectable()
export class UserInfoComponent {

    getAccessToken(): any {
        if (typeof (Storage) !== 'undefined') {
            if (sessionStorage.getItem('access_token')) {
                return sessionStorage.getItem('access_token');
            }
        }
        return '';
    }

    setAccessToken(accessToken: any): void {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('access_token', accessToken);
            sessionStorage.setItem('STORAGE_KEY', accessToken);
        }
    }

    setUserName(userName: any): void {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('userName', userName);
        }
    }

    getUserName(): any {
        if (typeof (Storage) !== 'undefined') {
            if (sessionStorage.getItem('userName')) {
                return sessionStorage.getItem('userName');
            }
        }
        return '';
    }
/* testing */
    setUserId(idUser: any): void {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('idUser', idUser);
        }
    }
    getUserId(): any {
        if (typeof (Storage) !== 'undefined') {
           if (sessionStorage.getItem('idUser')) {
            return sessionStorage.getItem('idUser');
           }
        }
        return '';
    }
/* testing */
    setCountryId(idCountry: any): void {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('idCountry', idCountry);
        }
    }

    getCountryId(): any {
        if (typeof (Storage) !== 'undefined') {
            if (sessionStorage.getItem('idCountry')) {
                return sessionStorage.getItem('idCountry');
            }
        }
        return '';
    }

    clearAllSessions() {
        sessionStorage.setItem('access_token', null);
            sessionStorage.setItem('STORAGE_KEY', null);
        sessionStorage.clear();
    }

    setTimeput(timeout: any): void {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('timeout', timeout);
        }
    }

    getTimeput(): any {
        if (typeof (Storage) !== 'undefined') {
            if (sessionStorage.getItem('timeout')) {
                return sessionStorage.getItem('timeout');
            }
        }
        return '20';
    }

    setUserPreferences(preferenceString) {
        if (typeof (Storage) !== 'undefined') {
            sessionStorage.setItem('userPreferences', preferenceString);
        }
    }
    getUserPreferences() {
        if (typeof (Storage) !== 'undefined') {
            if (sessionStorage.getItem('userPreferences')) {
                return JSON.parse(sessionStorage.getItem('userPreferences'));
            }
        }
        return '';
    }
}
