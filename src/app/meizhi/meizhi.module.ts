import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { ApiService } from './api.service';

import { MeizhiRoutingModule } from './meizhi-routing.module';
import { MeizhiComponent } from './meizhi.component';

@NgModule({
    declarations: [
        MeizhiComponent
    ],
    imports: [CommonModule, HttpClientModule, FormsModule, SharedModule, MeizhiRoutingModule],
    providers: [
        DatePipe,
        ApiService
    ]
})
export class MeizhiModule { }
