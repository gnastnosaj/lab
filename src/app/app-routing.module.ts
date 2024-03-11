import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', redirectTo: 'magneto', pathMatch: 'full'
}, {
  path: 'meizhi', loadChildren: () => import('./meizhi/meizhi.module').then(m => m.MeizhiModule)
}, {
  path: 'magneto', loadChildren: () => import('./magneto/magneto.module').then(m => m.MagnetoModule)
}, {
  path: 'voice-changer', loadChildren: () => import('./voice-changer/voice-changer.module').then(m => m.VoiceChangerModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
