import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Hammer from 'hammerjs';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RxBus } from '../rxbus';
import { Cognitive } from './cognitive';

@Component({
  selector: 'app-cognitive',
  template: `
    <app-lottie path="assets/lottie/voice.json" [play]="recording">
    </app-lottie>
    <div #play>
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
      cursor: pointer !important;
    }
  `]
})
export class CognitiveComponent implements OnInit, AfterViewInit {
  @ViewChild('play')
  play: ElementRef<HTMLDivElement>;

  cognitive: Cognitive;
  recording = false;
  recordSubscription: Subscription;

  constructor(private rxbus: RxBus) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const hammer = new Hammer(this.play.nativeElement);
    hammer.on('press', () => this.startRecording());
    hammer.on('pressup', () => this.stopRecording());
  }

  startRecording() {
    if (!this.recording) {
      this.recording = true;
      this.recordSubscription = this.cognitive.record(buffer => {
        this.cognitive.iat(buffer)
          .pipe(
            map(output => JSON.parse(output)),
            map(args => {
              this.rxbus.post(args.tag, args.payload);
              switch (args.tag) {
                case 'magneto':
                  return '正在搜索，请稍候。';
                case 'voice-changer':
                  return args.payload.keyword;
                default:
                  return null;
              }
            }),
            catchError(() => of('不好意思，没听清呢，请再试一次哟。'))
          )
          .subscribe(answer => {
            if (answer) {
              this.cognitive.tts(answer).subscribe(blob => {
                this.rxbus.post('cognitive', {
                  text: answer,
                  audio: blob,
                  date: new Date()
                });
                this.cognitive.play(blob);
              });
            }
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
