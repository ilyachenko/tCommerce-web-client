import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { ServiceMenuModule } from '../service-menu/service-menu.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    ServiceMenuModule,
    TranslateModule
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
