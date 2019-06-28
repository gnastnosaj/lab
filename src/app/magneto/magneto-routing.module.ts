import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MagnetoComponent } from './magneto.component';

const routes: Routes = [
    {
        path: '',
        component: MagnetoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MagnetoRoutingModule { }
