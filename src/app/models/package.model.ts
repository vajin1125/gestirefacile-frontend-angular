import { FuseUtils } from '@fuse/utils';
import { PackageDetail } from './packageDetail';
import { User } from './user.model';


export class Package
{
    oid: number;
    name: string;
    descr: string;
    image?: string;
    enabled: boolean;
    total_price: string;
    user: User;
    package_details: PackageDetail[];
    extra_details: PackageDetail[];


    constructor(_package?)
    {
        _package = _package || {};
        this.oid = _package.oid || '';
        this.name = _package.name || '';
        this.descr = _package.descr || '';
        this.image = _package.image  || '';
        this.enabled = (_package.enabled == 1 || _package.enabled == "true")  || false;
        this.total_price = _package.total_price || '';
        this.user = _package.user || '';
        this.package_details = _package.package_details || [];
        this.extra_details = _package.extra_details || [];
    }
}

