import { Role } from "./role.model";


export class PlanDetail
{
    oid: number;
    role: Role;
    max_qta: number;


constructor(planDetail?)
    {
        this.oid = planDetail.oid || '';
        this.role = planDetail.role || '';
        this.max_qta = planDetail.max_qta || 0;
        
    }
}