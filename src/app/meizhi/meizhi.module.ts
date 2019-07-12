import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ApiService } from './api.service';

import { MeizhiRoutingModule } from './meizhi-routing.module';
import { MeizhiComponent } from './meizhi.component';

@NgModule({
    declarations: [
        MeizhiComponent
    ],
    imports: [CommonModule, FormsModule, SharedModule, NgZorroAntdModule, MeizhiRoutingModule],
    providers: [ApiService]
})
export class MeizhiModule { }
