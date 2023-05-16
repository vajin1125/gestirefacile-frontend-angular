
import { FuseUtils } from '@fuse/utils';
import { Attribute } from './attribute.model';
import { Business } from './business.model';
import { Customer } from './customer.model';
import { EventDetail } from './eventDetail.model';
import { EventStatus } from './eventStatus.model';
import { EventType } from './eventType.model';
import { VendorAssoc } from './eventVendorAssoc.model';
import { Package } from './package.model';
import { Payment } from './payment.model';
import { User } from './user.model';

export class EntertrainerAvailability
{
    oid: number;
    business: Business;
    user_create: User;
    title: string;
    start_date: Date;
    end_date: Date;
    start_dt: string;
    end_dt: string;
    start_time: string;
    end_time: string;
    location: string;
    note: string;
    primary_color: string;
    secondary_color: string;
    all_day: boolean;

    constructor(entertrainerAvailability?)
    {
      entertrainerAvailability = entertrainerAvailability || {};
      this.oid = entertrainerAvailability.oid || '';
      this.business = entertrainerAvailability.business || new Business();
      this.user_create = entertrainerAvailability.user_create || '';
      this.title = entertrainerAvailability.title || '';
      this.start_date = entertrainerAvailability.start_date || '';
      this.end_date = entertrainerAvailability.end_date || '';
      this.start_dt = entertrainerAvailability.start_date && new Date(entertrainerAvailability.start_date).toISOString().substring(0,10) || '';
      this.end_dt = entertrainerAvailability.end_date && new Date(entertrainerAvailability.end_date).toISOString().substring(0,10) || '';
      this.start_time = entertrainerAvailability.start_time || '';
      this.end_time = entertrainerAvailability.end_time || '';
      this.location = entertrainerAvailability.location || '';
      this.note = entertrainerAvailability.note || '';
      this.primary_color = entertrainerAvailability.primary_color || '';
      this.secondary_color = entertrainerAvailability.secondary_color || '';
      this.all_day = (entertrainerAvailability.all_day == 1 || entertrainerAvailability.all_day == "true") || false;
    }
}

