import { FuseUtils } from '@fuse/utils';


export class MovementType
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(movementType?)
    {
        movementType = movementType || {};
        this.oid = movementType.oid || '';
        this.acronym = movementType.acronym || '';
        this.descr = movementType.descr || '';

    }
}
