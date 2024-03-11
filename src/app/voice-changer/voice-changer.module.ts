import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceChangerComponent } from './voice-changer.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { VoiceChangerRoutingModule } from './voice-changer-routing.module';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    VoiceChangerComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    NzButtonModule,
    NzIconModule,
    NzTimelineModule,
    VoiceChangerRoutingModule
  ]
})
export class VoiceChangerModule { }
