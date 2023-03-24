import { FuseUtils } from '@fuse/utils';
import { Circle } from './circle.model';
import { Customer } from './customer.model';

export class CircleCustomerAssoc {
    oid: number;
    circle: Circle;
    customer: Customer;

    constructor(custassoc?) {
        custassoc = custassoc || {};
        this.oid = custassoc.oid || '-1';
        this.circle = custassoc.circle || new Circle();
        this.customer = custassoc.customer || new Customer();
    }
}
