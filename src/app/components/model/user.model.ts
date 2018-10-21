import { Role } from './role.model';

export class User {
    userId = '0';
    userName = '';
    pwd: string;
    password_salt = '';
    countryId = '';
    last_login_date = false;
    login_expires?: string;
    num_of_attempts_allowed: string;
    locked = false;
    pwd_reset_required: string;
    date_created: string;
    email = '';
    last_password_change_date: string;
    frUserRoleRequest: Role[];
    frUserRoles: Role[];
    selectedRole: string;
    role: string;
    country: string;
    memberId: string;
    isInternal = false;
}
