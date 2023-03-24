import { Component } from '@angular/core';
import { MyBusinessesService } from 'app/main/mybusiness/mybusinesses/mybusinesses.service';
import { Business } from 'app/models/business.model';
import { DashboardComponent } from '../../dashboard.component';

@Component({
    selector: 'file-manager-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class FileManagerMainSidebarComponent {
    selected: any;
    statuses = [];
    resources = [];
    todo = [];
    dataStatus: any;
    dataBusiness: any;
    dataResource: any;
    businesses : Business[];
    dataToDo : any;
    s: any;
    b: any;
    r: any;
    t: any;

    constructor(private _businessesmanagerService: MyBusinessesService,
        private dashboard: DashboardComponent
        ) {
        
        this.dataStatus = [{
            "id": "2",
            "label": "Confermato"
        }];

        this.dataToDo =  [{
            "id": "1",
            "label": "Mostra To Do"
        }];

        setTimeout(() => {
            this.todo = [
                {
                    "id": "1",
                    "label": "Mostra To Do"
                }
            ]
            this.resources = [
                {
                    "id": "1",
                    "label": "Mostra Risorse"
                }
            ]
            this.statuses = [
                {
                    "id": "1",
                    "label": "Preventivo"
                },
                {
                    "id": "2",
                    "label": "Confermato"
                },
                {
                    "id": "3",
                    "label": "Confermato da Completare"
                },
                {
                    "id": "4",
                    "label": "Annullato"
                },
                {
                    "id": "5",
                    "label": "Completato"
                },
                {
                    "id": "6",
                    "label": "Cestinato"
                }
            ];
        }, 1000);
    }

    ngOnInit(): void {
        this._businessesmanagerService.getBusinesses().subscribe((businesses: Business[]) => {
            this.businesses = businesses;
            this.dataBusiness = businesses;
        }, error => console.error(error));
    }

    compareStatus(st1: any, st2: any) {
        return st1 && st2 ? st1.id === st2.id : st1 === st2;
    }

    onNgModelChangeStatus(event){
        console.log('on ng model change status', event);
        this.dashboard.filterEventByStatus(event, this.dataBusiness);
    }

    compareBusiness(st1: Business, st2: Business) {
        return st1 && st2 ? st1.oid === st2.oid : st1 === st2;
    }

    onNgModelChangeBusiness(event){
        console.log('on ng model change business', event);
        this.dashboard.filterEventByBusiness(event, this.dataStatus);
    }

    compareResource(st1: any, st2: any) {
        return st1 && st2 ? st1.id === st2.id : st1 === st2;
    }

    onNgModelChangeResource(event){
        console.log('on ng model change resource', event);
    }

    onNgModelChangeTodo(event) {
        this.dashboard.filterTodo(this.dataToDo);
    }


}
