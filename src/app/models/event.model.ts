
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

export class Event
{
    oid: number;
    business: Business;
    customer: Customer;
    type: EventType;
    status: EventStatus;
    from: Date;
    to: Date;
    from_dt: string;
    to_dt: string;
    from_ts_hh: string;
    from_ts_mi: string;
    to_ts_hh: string;
    to_ts_mi: string;
    address: string;
    user_create: User;
    creation_ts: Date;
    info_event: string;
    total: string;
    total_real: string;
    total_days: number = 0;
    total_hours: number = 0;
    event_details: EventDetail[];
    extra_details: EventDetail[];
    packages_assoc: Package[];
    vendor_assoc: VendorAssoc[];
    payment_assoc: Payment[];
    all_day: boolean;
    warning: boolean = false;
    attribute_assoc?: Attribute[];
    note: string;
    vat: number = 0;
    total_taxable: string;
    attach_file: string;

    constructor(event?)
    {
        event = event || {};
        this.oid = event.oid || '';
        this.business = event.business || new Business();
        this.customer = event.customer || new Customer();
        this.type = event.type || new EventType();
        this.status = event.status || EventStatus.PREVENTIVO;
        this.from = event.from || '';
        this.to = event.to || '';
        this.from_dt = event.from && new Date(event.from).toISOString().substring(0,10) || '';
        this.to_dt = event.to && new Date(event.to).toISOString().substring(0,10) || '';
        this.from_ts_hh = event.from && (new Date(event.from).getHours()+"").padStart(2, "0") || '';
        this.from_ts_mi = event.from && (new Date(event.from).getMinutes()+"").padStart(2, "0") || '';
        this.to_ts_hh = event.to && (new Date(event.to).getHours()+"").padStart(2, "0") || '';
        this.to_ts_mi = event.to && (new Date(event.to).getMinutes()+"").padStart(2, "0") || '';
        this.address = event.address || '';
        this.user_create = event.user_create || '';
        this.creation_ts = event.creation_ts || '';
        this.info_event = event.info_event || '';
        this.total = event.total || '';
        this.total_real = event.total_real || '';
        this.total_days = event.total_days || 0;
        this.total_hours = event.total_hours || 0;
        this.packages_assoc = event.packages_assoc || [];
        this.vendor_assoc = event.vendor_assoc || [];
        this.payment_assoc = event.payment_assoc || [];
        this.event_details = event.event_details || [];
        this.extra_details = event.extra_details || [];
        this.all_day = (event.all_day == 1 || event.all_day == "true")  || false;
        this.warning = (event.warning == 1 || event.warning == "true")  || false;
        this.attribute_assoc = event.attribute_assoc || [];
        this.note = event.note || '';
        this.vat = event.vat || 0;
        this.total_taxable = event.total_taxable || '';
        this.attach_file = event.attach_file || '';
    }
}

