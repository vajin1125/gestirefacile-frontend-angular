import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwesomeTooltipDirective } from './tooltip.directive';
import { AwesomeTooltipComponent } from './tooltip.component';

 @NgModule({
   declarations: [
    AwesomeTooltipDirective,
    AwesomeTooltipComponent
   ],
   imports: [
     CommonModule
   ],
   exports: [
    AwesomeTooltipDirective,
    AwesomeTooltipComponent
   ],
   providers: [

   ],
   entryComponents: [AwesomeTooltipComponent]
 })
 export class ToolTipModule { }