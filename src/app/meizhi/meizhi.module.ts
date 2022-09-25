import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ApiService } from './api.service';

import { MeizhiRoutingModule } from './meizhi-routing.module';
import { MeizhiComponent } from './meizhi.component';

import { CorsInterceptor } from '../shared/cors-interceptor';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        MeizhiComponent
    ],
    imports: [CommonModule, HttpClientModule, FormsModule, SharedModule, MeizhiRoutingModule],
    providers: [
        ApiService,
        ...(environment.electron ? [{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }] : [])
    ]
})
export class MeizhiModule { }
