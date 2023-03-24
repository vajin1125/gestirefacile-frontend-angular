import { FuseUtils } from '@fuse/utils';
import { ResourceType } from './resourceType.model';

export class Category
{
    oid: number;
    acronym: string;
    descr: string;
    resourceType: ResourceType;


    constructor(category?)
    {
        category = category || {};
        this.oid = category.oid || '';
        this.acronym = category.acronym || '';
        this.descr = category.descr || '';
        this.resourceType = category.resourceType;
    }
}

