import { FuseUtils } from '@fuse/utils';

import { Vendor } from './vendor.model';




export class VendorAssoc {
    oid: number;
    vendor: Vendor;


    constructor(vendorAssoc?)
    {
        vendorAssoc = vendorAssoc || {};
        this.oid = vendorAssoc.oid || '';
        this.vendor = vendorAssoc.vendor || '';
    }
}




