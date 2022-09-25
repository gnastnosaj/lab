import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeizhiComponent } from './meizhi.component';

const routes: Routes = [
    {
        path: '',
        component: MeizhiComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MeizhiRoutingModule { }
