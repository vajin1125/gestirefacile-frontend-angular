import { FuseUtils } from '@fuse/utils';


export class Price
{
    oid: number;
    descr: string;
    price: string;
    default: number;

    constructor(price?)
    {
        this.oid = price.oid || '';
        this.descr = price.descr || '';
        this.price = this.price || '0,00';
        this.default = price.default || 0;
    }
    
}
