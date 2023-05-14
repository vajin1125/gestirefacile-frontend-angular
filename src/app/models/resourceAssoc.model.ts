import { FuseUtils } from '@fuse/utils';
import { Resource } from './resource.model';




export class ResourceAssoc {
    oid: number;
    resourceAssoc: Resource;
    qta: number;
    address: string;
    refNumber: string;

    constructor(resourceAssoc?)
    {
        resourceAssoc = resourceAssoc || {};
        this.oid = resourceAssoc.oid || '';
        this.resourceAssoc = resourceAssoc.resourceAssoc || '';
        this.qta = resourceAssoc.qta || 1;
        this.address = resourceAssoc.address || '';
        this.refNumber = resourceAssoc.refNumber || '';
    }
}




