import { FuseUtils } from '@fuse/utils';
import { AttributeType } from './attributeType.model';
import { Business } from './business.model';
import { User } from './user.model';

export class Attribute
{
    oid: number;
    attributeType: AttributeType;
    business: Business;
    user: User;
    name: string;
    value?: string;

    constructor(attribute?)
    {
        attribute = attribute || {};
        this.oid = attribute.oid || '';
        this.attributeType = attribute.attributeType || '';
        this.business = attribute.business || '';
        this.user = attribute.user || '';
        this.name = attribute.name || '';
        this.value = attribute.value || '';
    }
}
