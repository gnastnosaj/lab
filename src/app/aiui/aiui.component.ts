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
      setTimeout(() => {
        this.aiui.iat('搜索变形金刚').subscribe(output => {
          this.aiui.tts(output).subscribe(blob => {
            console.log(URL);
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
      }, 3000);
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
