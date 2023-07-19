import { MessageBoxType } from 'src/app/pages/message-box/message.box';
import { global } from 'src/globals/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'darta-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent  {

  message:string;
  isQuestion:boolean;
  gl:any = global;
  constructor(private dialogRef: MatDialogRef<QuestionComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any) {
      this.message = data.msg;
      this.isQuestion = data.type == MessageBoxType.Question;
  }

  close(answer: string) {
    this.dialogRef.close(answer);
  }


}
