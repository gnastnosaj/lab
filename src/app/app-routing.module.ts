import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '', redirectTo: 'magneto', pathMatch: 'full'
}, {
  path: 'meizhi', loadChildren: () => import('./meizhi/meizhi.module').then(m => m.MeizhiModule)
}, {
  path: 'magneto', loadChildren: () => import('./magneto/magneto.module').then(m => m.MagnetoModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
