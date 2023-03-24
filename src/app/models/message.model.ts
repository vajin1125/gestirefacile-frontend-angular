import { FuseUtils } from '@fuse/utils';
import { Business } from './business.model';
import { Role } from './role.model';
import { User } from './user.model';

export class Message {
    oid: number;
    oid_user_create: number;
    title?: string;
    text?: string;
    url?: string;
    payload: string;
    creation_ts: Date;
    business?: Business;
    user_sent?: User;
    role: Role;
    sent_ts: Date;

    constructor(message?) {
        message = message || {};
        this.oid = message.oid || '-1';
        this.oid_user_create = message.oid_user_create || '-1';
        this.title = message.title || '';
        this.text = message.text || '';
        this.url = message.url || '',
        this.payload = message.payload || '',
        this.creation_ts = message.creation_ts || '',
        this.business = message.business || new Business(),
        this.user_sent = message.user_sent || new User();
        this.role = message.role || new Role();
        this.sent_ts = message.sent_ts || ''
    }
}
