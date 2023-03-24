import { FuseUtils } from '@fuse/utils';
import { PlanDetail } from './planDetail.model';

export class Plan
{
    oid: number;
    acronym: string;
    descr: string;
    enabled: boolean;
    price: string;
    unlimited: boolean;
    details: PlanDetail[];

    constructor(plan?)
    {
        this.oid = plan.oid || '';
        this.acronym = plan.acronym || '';
        this.descr = plan.descr || '';
        this.enabled = (plan.enabled == 1 || plan.enabled == "true")  || false;
        this.price = this.price || '0,00';
        this.unlimited = (plan.unlimited == 1 || plan.unlimited == "true")  || false;
        this.details = plan.details || [];
    }
    
}
