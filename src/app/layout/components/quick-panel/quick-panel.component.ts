import { Component, ViewEncapsulation } from '@angular/core';


@Component({
    selector     : 'quick-panel',
    templateUrl  : './quick-panel.component.html',
    styleUrls    : ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent
{
    date: Date;
    events: any[];
    alarms: any[];
    messages: any[];
    settings: any;

    /**
     * Constructor
     */
    constructor()
    {
        this.date = new Date();
        // Set the defaults
        
        
       /* setInterval(() => {
            this.date = new Date();
        }, 1000) // Updates the time every second.
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };*/
    }
}
