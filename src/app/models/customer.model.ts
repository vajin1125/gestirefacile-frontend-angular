import { FuseUtils } from '@fuse/utils';
import { Attribute } from './attribute.model';
import { CircleCustomerAssoc } from './circle-customer-assoc';
import { User } from './user.model';


export class Customer {
    oid: number;
    oid_user: number;
    oid_customer_by_user: number;
    user: User;
    name: string;
    surname: string;
    email: string;
    desc: string;
    address: string;
    tel?: string;
    cell?: string;
    piva?: string;
    circle_customer_assoc?: CircleCustomerAssoc[];
    attribute_assoc?: Attribute[];

    constructor(customer?)
    {
        customer = customer || {};
        this.oid = customer.oid || '';
        this.oid_user = customer.oid_user || '';
        this.oid_customer_by_user = customer.oid_customer_by_user || '';
        this.name = customer.name || '';
        this.surname = customer.surname || '';
        this.email = customer.email || '';
        this.desc = customer.desc || '';
        this.address = customer.address || '';
        this.tel = customer.tel || '';
        this.cell = customer.cell || '';
        this.piva = customer.piva || '';
        this.circle_customer_assoc = customer.circle_customer_assoc || [];
        this.attribute_assoc = customer.attribute_assoc || [];
    }
}




