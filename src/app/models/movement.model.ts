import { FuseUtils } from '@fuse/utils';
import { timeStamp } from 'console';
import { isThisISOWeek } from 'date-fns';
import {Event} from './event.model';
import { MovementType } from './movementType.model';
import { Resource } from './resource.model';
import { User } from './user.model';
import { Warehouse } from './warehouse.model';

export class Movement
{
    oid: number;
    event: Event;
    warehouse: Warehouse;
    user: User;
    resource: Resource;
    type: MovementType;
    qta: number;
    reason: string;
    date_ts: Date;   


    constructor(movement?)
    {
        movement = movement || {};
        this.oid = movement.oid || '';
        this.event = movement.event || {};
        this.warehouse = movement.warehouse || {};
        this.user = movement.user || {};
        this.resource = movement.resource || {};
        this.type = movement.type || {};
        this.qta = movement.qta || 0;
        this.reason = movement.reason || '';
        this.date_ts = movement.date_ts || '';
    }
}
