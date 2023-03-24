import { FuseUtils } from '@fuse/utils';

export class EventType
{
    oid: number;
    acronym: string;
    descr: string;


    constructor(eventType?)
    {
        eventType = eventType || {};
        this.oid = eventType.oid || '';
        this.acronym = eventType.acronym || '';
        this.descr = eventType.descr || '';
    }
}

