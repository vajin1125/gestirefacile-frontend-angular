import { FuseUtils } from '@fuse/utils';
import { Category } from './category.model';
import { Resource } from './resource.model';
import { ResourceType } from './resourceType.model';
import { Skill } from './skill.model';


export class EventDetail {
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
    oid_package: number;




    constructor(eventDetail?) {
        eventDetail = eventDetail || {};
        this.oid = eventDetail.oid || '';
        this.resourceType = eventDetail.resourceType || '';
        this.category = eventDetail.category || '';
        this.skill = eventDetail.skill || '';
        this.resource = eventDetail.resource || '';
        this.qta = eventDetail.qta || 0;
        this.price = eventDetail.price || '0,00';
        this.extra_descr = eventDetail.extra_descr || '';
        this.is_extra = eventDetail.is_extra || false;
        this.fully = eventDetail.fully || true;
        this.note = eventDetail.note || '';
        this.hours = eventDetail.hours || 0;
        this.days = eventDetail.days || 0;
        this.total_price = eventDetail.total_price || '0,00';
        this.oid_package = eventDetail.oid_package || '';
    }
}

