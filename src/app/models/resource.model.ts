import { FuseUtils } from '@fuse/utils';
import { Category } from './category.model';
import { Movement } from './movement.model';
import { Price } from './price.model';
import { ResourceAssoc } from './resourceAssoc.model';
import { ResourceType } from './resourceType.model';
import { Skill } from './skill.model';
import { User } from './user.model';



export class Resource {
    oid: number;
    resourceType: ResourceType;
    user: User;
    code: string;
    name: string;
    surname: string;
    descr: string;
    available: boolean;
    avail_qta: number;
    email: string;
    tel?: string;
    cell?: string;
    address?: string;
    image?: string;
    gender: string;
    own_car: boolean;
    note: string;
    user_resource: User;
    width: number;
    height: number;
    deep: number;
    weight: number;
    position: string;
    capacity: string;
    consumable: boolean;
    create_user: boolean;
    resources_assoc?: ResourceAssoc[];
    categories_assoc?: Category[];
    skills_assoc?: Skill[];
    movements?: Movement[];
    prices?: Price[];
    warning: boolean = false;
    servicePropertyNote: string;
    events?: any;
    is_trash: number;

    constructor(resource?)
    {
        resource = resource || {};
        this.oid = resource.oid || '';
        this.resourceType = resource.resourceType || new ResourceType();
        this.user = resource.user || new User();
        this.code = resource.code || '';
        this.name = resource.name || '';
        this.surname = resource.surname || '';
        this.descr = resource.descr || '';
        this.avail_qta = resource.avail_qta || 1;
        this.available = (resource.available == 1 || resource.available == "true")  || false;
        this.tel = resource.tel || '';
        this.cell = resource.cell || '';
        this.address = resource.address || '';
        this.email = resource.email || '';
        this.gender = resource.gender || '';
        this.image = resource.image || '';
        this.own_car = (resource.own_car == 1 || resource.own_car == "true")  || false;
        this.note = resource.note || '';
        this.user_resource = resource.user_resource || '';
        this.width = resource.width || '';
        this.height = resource.height || '';
        this.deep = resource.deep || '';
        this.weight = resource.weight || '';
        this.position = resource.position || '';
        this.capacity = resource.capacity || '';
        this.consumable = (resource.consumable == 1 || resource.consumable == "true")  || false;
        this.create_user = (resource.create_user == 1 || resource.create_user == "true")  || false;
        this.resources_assoc = resource.resources_assoc || [];
        this.categories_assoc = resource.categories_assoc || [];
        this.skills_assoc = resource.skills_assoc || [];
        this.movements = resource.movements || [];
        this.prices = resource.prices || [];
        this.servicePropertyNote = resource.servicePropertyNote || '';
        this.events = resource.events || [];
        this.is_trash = resource.is_trash || '';
    }
}




