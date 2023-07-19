import { ChangeDetectorRef } from '@angular/core';


export class PasswordModel {
    
    visible:boolean = false;
    inputType:string = 'password';

    constructor(private cd: ChangeDetectorRef){}

    toggleVisibility() {
        if (this.visible) {
          this.inputType = 'password';
          this.visible = false;
        } else {
          this.inputType = 'text';
          this.visible = true;
        }
        this.cd.markForCheck();
    }
    
}

