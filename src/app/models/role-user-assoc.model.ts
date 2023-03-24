import { FuseUtils } from '@fuse/utils';
import { Business } from './business.model';
import { Plan } from './plan.model';
import { Role } from './role.model';
import { User } from './user.model';

export class RoleUserAssoc {
    oid: number;
    business: Business;
    role: Role;
    user?: User;
    plan?: Plan;

    constructor(roleassoc?) {
        roleassoc = roleassoc || {};
        this.oid = roleassoc.oid || '-1';
        this.business = roleassoc.business || new Business();
        this.role = roleassoc.role || new Role();
        this.user = roleassoc.user || new User();
        this.plan = roleassoc.plan || new Plan();
    }
}
