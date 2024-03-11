import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceChangerComponent } from './voice-changer.component';

const routes: Routes = [
    {
        path: '',
        component: VoiceChangerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VoiceChangerRoutingModule { }
