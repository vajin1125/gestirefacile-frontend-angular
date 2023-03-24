import { FuseUtils } from '@fuse/utils';
import { Category } from './category.model';
import { Resource } from './resource.model';
import { ResourceType } from './resourceType.model';
import { Skill } from './skill.model';


export class PackageDetail {
    oid: number;
    resourceType: ResourceType;
    category: Category;
    skill: Skill;
    resource: Resource;
    qta: number;
    price: string;
    extra_descr: string;
    is_extra: boolean;
    fully: boolean;
    note: string;
    hours: number;
    days: number;
    total_price: string;




    constructor(packageDetail?) {
        packageDetail = packageDetail || {};
        this.oid = packageDetail.oid || '';
        this.resourceType = packageDetail.resourceType || '';
        this.category = packageDetail.category || '';
        this.skill = packageDetail.skill || '';
        this.resource = packageDetail.resource || '';
        this.qta = packageDetail.qta || 0;
        this.price = packageDetail.price || '0,00';
        this.extra_descr = packageDetail.extra_descr || '';
        this.is_extra = packageDetail.is_extra || false;
        this.fully = packageDetail.fully || true;
        this.note = packageDetail.note || '';
        this.hours = packageDetail.hours || 0;
        this.days = packageDetail.days || 0;
        this.total_price = packageDetail.total_price || '0,00';
    }
}

