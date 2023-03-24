import { FuseUtils } from '@fuse/utils';

export class AttributeType
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(attributeType?)
    {
        attributeType = attributeType || {};
        this.oid = attributeType.oid || '';
        this.acronym = attributeType.acronym || '';
        this.descr = attributeType.descr || '';
    }
}

