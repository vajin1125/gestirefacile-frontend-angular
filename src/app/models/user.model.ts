
import { FuseUtils } from '@fuse/utils';
import { Attribute } from './attribute.model';
import { RoleUserAssoc } from './role-user-assoc.model';


export class User {
    oid: number;
    superuser: boolean;
    role_user_assoc?: RoleUserAssoc[];
    name: string;
    surname: string;
    username?: string;
    password?: string;
    email: string;
    enabled: boolean;
    tel?: string;
    cell?: string;
    max_business_num: number;
    change_password: boolean;
    token?: string;
    image?: string;
    oid_user_ref?: number;
    attribute_assoc: Attribute[];

    constructor(user?)
    {
        user = user || {};
        this.oid = user.oid || '';
        this.superuser = user.superuser == 1 || false;
        this.role_user_assoc = user.role_user_assoc || [];
        this.name = user.name || '';
        this.surname = user.surname || '';
        this.username = user.username || '';
        this.password = user.password || '';
        this.email = user.email || '';
        this.enabled = (user.enabled == 1 || user.enabled == "true")  || false;
        this.tel = user.tel || '';
        this.cell = user.cell || '';
        this.max_business_num = user.max_business_num || 0;
        this.change_password = user.change_password || true;
        this.token = user.token || '';
        this.image = user.image || '';
        this.oid_user_ref = user.oid_user_ref || '';
        this.attribute_assoc = user.attribute_assoc || '';
    }
}




