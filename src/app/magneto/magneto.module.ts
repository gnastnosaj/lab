import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CorsInterceptor } from '../shared/cors-interceptor';
import { SharedModule } from '../shared/shared.module';
import { ApiService } from './api.service';
import { MagnetoRoutingModule } from './magneto-routing.module';
import { MagnetoComponent } from './magneto.component';
import { RecordComponent } from './record/record.component';

@NgModule({
    declarations: [
        MagnetoComponent,
        RecordComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NzButtonModule,
        NzInputModule,
        NzListModule,
        NzMessageModule,
        NzPaginationModule,
        NzIconModule,
        MagnetoRoutingModule
    ],

    providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }
    ]
})
export class MagnetoModule { }
