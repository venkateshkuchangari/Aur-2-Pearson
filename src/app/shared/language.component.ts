import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageComponent {
    constructor(private translate: TranslateService) {
    }

    setLanguage() {
        return true;
    }
}
