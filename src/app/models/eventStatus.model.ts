import { FuseUtils } from '@fuse/utils';

export class EventStatus
{
    oid: number;
    acronym: string;
    descr: string;

    static PREVENTIVO:EventStatus = new EventStatus(1, "QUOTATION", "Preventivo");
    static CONFERMATA:EventStatus = new EventStatus(2, "CONFIRMED", "Confermata");
    static CONFERMATA_DA_COMPLETARE:EventStatus = new EventStatus(3, "CONFIRMED_TO", "Confermata da completare");
    static ANNULLATA:EventStatus = new EventStatus(4, "CANCELLED", "Annullata");
    static COMPLETATA:EventStatus = new EventStatus(5, "COMPLETED", "Conclusa");

    constructor(oid, acronym, descr)
    {
        this.oid = oid || '';
        this.acronym = acronym || '';
        this.descr = descr || '';
    }
    
}

