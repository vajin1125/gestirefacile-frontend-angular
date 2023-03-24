import { FuseUtils } from '@fuse/utils';

export class Role
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(role?)
    {
        role = role || {};
        this.oid = role.oid || '';
        this.acronym = role.acronym || '';
        this.descr = role.descr || '';
    }
}

