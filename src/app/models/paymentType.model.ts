import { FuseUtils } from '@fuse/utils';

export class PaymentType
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(paymentType?)
    {
        this.oid = paymentType.oid || '';
        this.acronym = paymentType.acronym || '';
        this.descr = paymentType.descr || '';
    }
    
}

