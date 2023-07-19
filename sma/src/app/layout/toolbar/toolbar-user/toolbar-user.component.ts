import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CambioDeClaveComponent } from 'src/app/pages/authentication/cambio-de-clave/cambio-de-clave.component';
import { global } from 'src/globals/global';

@Component({
  selector: 'fury-toolbar-user',
  templateUrl: './toolbar-user.component.html',
  styleUrls: ['./toolbar-user.component.scss']
})
export class ToolbarUserComponent implements OnInit {

  app:any = global;
  isOpen: boolean;
  userName: string;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.userName = global.user + '-' + global.userName;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }
  changePassword(){
    this.dialog.open(CambioDeClaveComponent);
  }
}
