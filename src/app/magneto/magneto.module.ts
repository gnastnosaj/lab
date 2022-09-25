import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { CorsInterceptor } from '../shared/cors-interceptor';
import { SharedModule } from '../shared/shared.module';
import { ApiService } from './api.service';
import { MagnetoRoutingModule } from './magneto-routing.module';
import { MagnetoComponent } from './magneto.component';

@NgModule({
    declarations: [
        MagnetoComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NzInputModule,
        NzListModule,
        NzIconModule,
        MagnetoRoutingModule
    ],

    providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }
    ]
})
export class MagnetoModule { }
