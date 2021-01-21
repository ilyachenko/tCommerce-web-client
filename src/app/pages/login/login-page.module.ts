import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { LoginPageComponent } from './login-page.component';
import { HeaderModule } from '../../header/header.module';
import { BreadcrumbsModule } from '../../breadcrumbs/breadcrumbs.module';
import { FooterModule } from '../../footer/footer.module';
import { LoginFormModule } from '../../login-form/login-form.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    HeaderModule,
    BreadcrumbsModule,
    FooterModule,
    LoginFormModule,
    TranslateModule.forChild()
  ]
})
export class LoginPageModule { }
