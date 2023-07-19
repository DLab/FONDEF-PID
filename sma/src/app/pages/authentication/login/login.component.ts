import { SidenavService } from './../../../layout/sidenav/sidenav.service';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUpAnimation } from '../../../../@fury/animations/fade-in-up.animation';
import { global } from 'src/globals/global';
import { LanguageComponent, setMenuLanguage } from '../../components/language/language.component';
import { FilterList } from 'src/app/utils/filter-list';
import { BaseService } from 'src/app/base.service';
import { PasswordModel } from '../password-model';


@Component({
  selector: 'darta-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation:ViewEncapsulation.None,
  animations: [fadeInUpAnimation]
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  listener:any;

  filterList:FilterList = new FilterList();
  screen: any = {};
  title:string = global.title;
  passwordModel:PasswordModel;

  @ViewChild(LanguageComponent, { read: ElementRef, static: true }) private autocomplete: ElementRef;

  constructor(private sidenavService: SidenavService,
              private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private service: BaseService) {
    global.user = null;
    this.passwordModel = new PasswordModel(cd);
  }

  ngOnInit() {
    this.screen = global.screen;
    global.load.addListener('loadok', this.listener = ()=>{
      this.screen = global.screen;
    });

    this.form = this.fb.group({
      id: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  ngOnDestroy(): void {
    global.load.removeListener('loadok', this.listener);
  }

  send() {
    if (!this.form.valid)
    {
      return;
    }
    var user: any = this.form.value;
    this.service.setCurrentUser({user: user, userBanca: user.idBanca, showResponseText:true, getMenu:'V2.0'}).subscribe(data=>
    {
        global.hasIdMenu = [];
        global.user = data['id'];
        global.userName = data['nombre'];
        global.accionesxFuncion = data['accionesxFuncion'];
        global.menues = JSON.parse(data['menues']);
        global.datosUsuario = data['datosUsuario'];
        global.passwordUser = data['password'];
        setMenuLanguage(global.menues);
        this.sidenavService.addItems(global.menues);
        this.router.navigate(['presentacion']);
      });

  }

}
