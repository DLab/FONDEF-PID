import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { global } from 'src/globals/global';
import { QuestionComponent } from './question/question.component';
import { WaitMessageComponent } from './wait-message/wait-message.component';

export enum MessageBoxType{
  Information
, Warning
, Success
, Error
, Question
, Ok
}

function traslateParam(param:string)
{
    var msg = global.screen[param.replace(/ /gi, "_")];
    return msg == undefined ? param : msg;
}
export function formatMessage(text:string, params:string[]):string{
    if (params == undefined)
    {
        return text;
    }
    for(var i in params)
    {
        text = text.replace('{' + i + '}', traslateParam(params[i]));
    }
    return text;
    
}

@Injectable()
export class MessageBox
{
    title:string = global.title;
    toastr: ToastrService;
    constructor(private toastrService: ToastrService,
                private dialog: MatDialog)
    {
        this.toastr = toastrService;
    }

    public showMessageBox(type: MessageBoxType, message: string): Observable<String>
    {
        switch(type)
        {
            case MessageBoxType.Success:
                this.toastr.success(message, this.title, {
                    timeOut: 2500,
                    extendedTimeOut: 300
                });
                break;
            case MessageBoxType.Information:
                this.toastr.info(message, this.title, {
                    timeOut: 2500,
                    extendedTimeOut: 300
                });
                break;
            case MessageBoxType.Warning:
                this.toastr.warning(message, this.title), {
                    timeOut: 6000,
                    extendedTimeOut: 300,
                    closeButton: true
                };
                break;
            case MessageBoxType.Error:                
                this.toastr.error(message, this.title, {
                    timeOut: 0,
                    extendedTimeOut: 300,
                    closeButton: true
                });
                break;
            case MessageBoxType.Information:
                this.toastr.info(message, this.title, {
                    timeOut: 6000,
                    extendedTimeOut: 300
                });
                break;
            case MessageBoxType.Question:
              return new Observable<String>(obj=>{
                this.dialog.open(QuestionComponent, {
                  disableClose: false,
                  data: {
                    msg: message,
                    type: type
                  },
                }).afterClosed().subscribe(result => {
                  obj.next(result);
                }); 
              });
              break;
            case MessageBoxType.Ok:
                this.dialog.open(QuestionComponent, {
                    disableClose: false,
                    data: {
                      msg: message,
                      type: type
                    }
                });
              
        }
        return null;
    }
    public showWaitMessageBox(message:String):MatDialogRef<WaitMessageComponent>
    {
        return this.dialog.open(WaitMessageComponent, {
            data: {msg: message}
          , panelClass: 'wait-class'
        });
    }
}

