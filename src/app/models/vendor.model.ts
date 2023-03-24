import { FuseUtils } from '@fuse/utils';


export class Vendor {
    oid: number;
    name: string;
    surname: string;
    business_name: string;
    email: string;
    address: string;
    tel?: string;
    cell?: string;
    piva?: string;
    iban?: string;
    pec?: string;


    constructor(vendor?)
    {
        vendor = vendor || {};
        this.oid = vendor.oid || '';
        this.name = vendor.name || '';
        this.surname = vendor.surname || '';
        this.business_name = vendor.business_name || '';
        this.email = vendor.email || '';
        this.address = vendor.address || '';
        this.tel = vendor.tel || '';
        this.cell = vendor.cell || '';
        this.piva = vendor.piva || '';
        this.iban = vendor.iban || '';
        this.pec = vendor.pec || '';
    }
}




