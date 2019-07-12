import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared/shared.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import isElectron from 'is-electron';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    NgZorroAntdModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: !isElectron() && environment.production })
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
