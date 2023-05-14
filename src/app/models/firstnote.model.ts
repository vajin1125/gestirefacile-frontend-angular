
import { FuseUtils } from '@fuse/utils';
import { User } from './user.model';

export class Firstnote
{
    oid: number;
    income: string;
    expenses: string;
    category: string;
    datetime: Date;
    description: string;
    // user: User;
    
    constructor(firstnote?)
    {
        firstnote = firstnote || {};
        this.oid = firstnote.oid || '';
        this.income = firstnote.title || '';
        this.expenses = firstnote.expenses || '';
        this.category = firstnote.category || '';
        this.datetime = firstnote.datetime || '';
        this.description = firstnote.description || '';
        // this.user = firstnote.user || '';
    }
}

