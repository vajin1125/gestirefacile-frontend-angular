import { FuseUtils } from '@fuse/utils';


export class PaymentMethod
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(paymentMethod?)
    {
        this.oid = paymentMethod.oid || '';
        this.acronym = paymentMethod.acronym || '';
        this.descr = paymentMethod.descr || '';
    }
    
}

