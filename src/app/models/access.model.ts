import { FuseUtils } from '@fuse/utils';
import { User } from './user.model';

export class AccessLog
{
    oid: number;
    ip_address: string;
    user: User;
    creation_ts: Date;
    latitude : number;
    longitude : number;



    constructor(log?)
    {
        log = log || {};
        this.oid = log.oid || '';
        this.ip_address = log.ip_address || '';
        this.user = log.user || new User();
        this.latitude = log.latitude || 0;
        this.longitude = log.longitude || 0;
    }
}
