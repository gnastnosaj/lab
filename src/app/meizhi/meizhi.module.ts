import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ApiService } from './api.service';

import { MeizhiRoutingModule } from './meizhi-routing.module';
import { MeizhiComponent } from './meizhi.component';

import { CorsInterceptor } from '../shared/cors-interceptor';
import isElectron from 'is-electron';

@NgModule({
    declarations: [
        MeizhiComponent
    ],
    imports: [CommonModule, HttpClientModule, FormsModule, SharedModule, NgZorroAntdModule, MeizhiRoutingModule],
    providers: [
        ApiService,
        ...(!isElectron() ? [] : [{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }])
    ]
})
export class MeizhiModule { }
