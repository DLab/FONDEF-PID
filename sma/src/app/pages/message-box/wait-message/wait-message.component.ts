import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';

@Component({
  selector: 'darta-wait-message',
  templateUrl: './wait-message.component.html',
  styleUrls: ['./wait-message.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WaitMessageComponent implements OnInit, OnDestroy {

  msg:string;
  waitMsg:string;
  quit:boolean;
  numPoints:number;
  constructor(@Inject(MAT_DIALOG_DATA) public data) { 
    this.msg = data.msg;
  }
  ngOnDestroy(): void {
    this.quit = true;
  }

  ngOnInit() {
    this.quit = false;
    this.numPoints = 0;
    this.showMsg();
  }
  showMsg(){
    if (this.quit){
      return;
    }
    const ctr:WaitMessageComponent = this;
    setTimeout(function(){
        if (++ctr.numPoints >= 10){
          ctr.numPoints = 0;
          ctr.waitMsg = ctr.msg + ' '.repeat(10);
        }
        else
        {
          ctr.waitMsg = ctr.msg + '.'.repeat(ctr.numPoints);
        }
        ctr.showMsg();

    }, 500);  
  }

}
