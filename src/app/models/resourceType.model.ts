import { FuseUtils } from '@fuse/utils';

export class ResourceType
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(resourceType?)
    {
        resourceType = resourceType || {};
        this.oid = resourceType.oid || '';
        this.acronym = resourceType.acronym || '';
        this.descr = resourceType.descr || '';
    }
}

