import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class RoleGuardService implements CanActivate {
  private roleList: any[];
  private userRoles: any[];
  constructor(public _router: Router) {
    this.roleList = JSON.parse(sessionStorage.getItem('roleList'));
    this.userRoles = JSON.parse(sessionStorage.getItem('roles'));
  }
  canActivate() {
    for (let i in this.userRoles) {
      if (this.isAdmin(this.userRoles[i])) {
        return true;
      }
    }
    this._router.navigate(['login']);
    return false;
  }
  isAdmin(userRole) {
    for (let i in this.roleList) {
      if (userRole.roleId == this.roleList[i].roleId && this.roleList[i].roleDesc=='Administrator')
        return true;
    }
    return false;
  }
}
