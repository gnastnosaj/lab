import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ApiService } from './api.service';

import { MagnetoRoutingModule } from './magneto-routing.module';
import { MagnetoComponent } from './magneto.component';

import { CorsInterceptor } from '../shared/cors-interceptor';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [
        MagnetoComponent
    ],
    imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, SharedModule, NgZorroAntdModule, MagnetoRoutingModule],

    providers: [
        ApiService,
        ...(environment.electron ? [{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }] : [])
    ]
})
export class MagnetoModule { }
