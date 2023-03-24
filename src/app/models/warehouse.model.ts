import { FuseUtils } from '@fuse/utils';
import { Business } from './business.model';
import { User } from './user.model';


export class Warehouse {
    oid: number;
    acronym: string;
    descr: string;
    address: string;
    tel?: string;
    user: User;
    business: Business;


    constructor(warehouse?)
    {
        warehouse = warehouse || {};
        this.oid = warehouse.oid || '';
        this.acronym = warehouse.acronym || '';
        this.descr = warehouse.descr || '';
        this.address = warehouse.address || '';
        this.tel = warehouse.tel || '';
        this.user = warehouse.user || '';
        this.business = warehouse.business || '';
    }
}




