import { FuseUtils } from '@fuse/utils';
import { PaymentMethod } from './paymentMethod.model';
import { PaymentType } from './paymentType.model';


export class Payment
{
    oid: number;
    amount: string;
    paymentType: PaymentType;
    paymentMethod: PaymentMethod;
    paymentDate: any;
    paymentNote: any;


    constructor(paymentMethod?)
    {
        this.oid = paymentMethod.oid || '';
        this.amount = paymentMethod.amount || '';
        this.paymentType = paymentMethod.paymentType || '';
        this.paymentMethod = paymentMethod.paymentMethod || '';
    }
    
}

