import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { soundManager } from 'soundmanager2';
import { AIUI } from './aiui';

@Component({
  selector: 'app-aiui',
  template: `
    <app-lottie path="assets/lottie/voice.json" [play]="recording"
      (mousedown)="startRecording()" (mouseup)="stopRecording()" (mouseout)="stopRecording()">
    </app-lottie>
  `,
  styles: [`
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
      this.aiui.record().subscribe(buffer => {
        this.aiui.iat(buffer).subscribe(answer => {
          this.aiui.tts(answer).subscribe(blob => {
            soundManager
              .createSound({
                url: URL.createObjectURL(blob),
                onload() {
                  this.play();
                }
              })
              .load();
          });
        });
      });
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
