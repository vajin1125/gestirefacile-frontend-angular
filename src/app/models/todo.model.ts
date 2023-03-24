
import { FuseUtils } from '@fuse/utils';
import { Business } from './business.model';
import { User } from './user.model';

export class ToDo
{
    oid: number;
    title: string;
    descr: string;
    datetime: Date;
    user: User;
    business: Business;
    completed: boolean;
    


    constructor(todo?)
    {
        todo = todo || {};
        this.oid = todo.oid || '';
        this.title = todo.title || '';
        this.descr = todo.descr || '';
        this.datetime = todo.datetime || '';
        this.user = todo.user || '';
        this.business = todo.business || '';
        this.completed = (todo.completed == 1 || todo.completed == "true")  || false;
    }
}

