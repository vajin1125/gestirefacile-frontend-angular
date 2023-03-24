import { FuseUtils } from '@fuse/utils';
import { CircleCustomerAssoc } from './circle-customer-assoc';

export class Circle
{
    oid: number;
    acronym: string;
    descr: string;
    circle_customer_assoc?: CircleCustomerAssoc[];

    constructor(circle?)
    {
        circle = circle || {};
        this.oid = circle.oid || '';
        this.acronym = circle.acronym || '';
        this.descr = circle.descr || '';
        this.circle_customer_assoc = circle.circle_customer_assoc || [];
    }
}

