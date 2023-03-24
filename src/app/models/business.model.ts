import { FuseUtils } from '@fuse/utils';
import { RoleUserAssoc } from './role-user-assoc.model';


export class Business
{
  oid: number;
  name: string;
  descr: string;
  validity_from: Date;
  validity_to: Date;
  enabled: boolean;
  logo?: string;
  address?: string;
  piva?: string;
  tel?: string;
  cell?: string;
  email?: string;
  creation_date: Date;
  role_user_assoc?: RoleUserAssoc[];
  color?: string;

  constructor(business?)
  {
      business = business || {};
      this.oid = business.oid || '';
      this.name = business.name || '';
      this.descr = business.descr || '';
      this.validity_from = business.validity_from;
      this.validity_to = business.validity_to;
      this.enabled = (business.enabled == 1 || business.enabled == "true")  || false;
      this.logo = business.logo || '';
      this.address = business.address || '';
      this.piva = business.piva || '';
      this.tel = business.tel || '';
      this.cell = business.cell || '';
      this.email = business.email || '';
      this.creation_date = business.creation_date;
      this.role_user_assoc = business.role_user_assoc || [];
      this.color = business.color || '';
  }
}
