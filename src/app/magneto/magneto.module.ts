import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { ApiService } from './api.service';

import { MagnetoRoutingModule } from './magneto-routing.module';
import { MagnetoComponent } from './magneto.component';

@NgModule({
    declarations: [
        MagnetoComponent
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, NgZorroAntdModule, MagnetoRoutingModule],
    providers: [ApiService]
})
export class MagnetoModule { }
