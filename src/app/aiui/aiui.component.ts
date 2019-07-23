import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AIUI } from './aiui';

@Component({
  selector: 'app-aiui',
  template: `
    <app-lottie path="assets/lottie/voice.json" [play]="recording">
    </app-lottie>
    <div (mousedown)="startRecording()" (mouseup)="stopRecording()" (mouseout)="stopRecording()">
    </div>
  `,
  styles: [`
    :host {
      position: relative;
    }
    div {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
  `]
})
export class AiuiComponent implements OnInit {
  aiui: AIUI;
  recording = false;
  recordSubscription: Subscription;

  ngOnInit() {
  }

  startRecording() {
    if (!this.recording) {
      this.recording = true;
      this.recordSubscription = this.aiui.record(buffer => {
        this.aiui.iat(buffer).subscribe(answer => {
          this.aiui.tts(answer).subscribe(blob => this.aiui.play(blob));
        });
      }).subscribe();
    }
  }

  stopRecording() {
    if (this.recording) {
      if (this.recordSubscription != null && !this.recordSubscription.closed) {
        this.recordSubscription.unsubscribe();
      }
      this.recording = false;
    }
  }
}
