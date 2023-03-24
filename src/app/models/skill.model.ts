import { FuseUtils } from '@fuse/utils';

export class Skill
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(skill?)
    {
        skill = skill || {};
        this.oid = skill.oid || '';
        this.acronym = skill.acronym || '';
        this.descr = skill.descr || '';
    }
}

