import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Hammer from 'hammerjs';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RxBus } from '../rxbus';
import { AIUI } from './aiui';

@Component({
  selector: 'app-aiui',
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
    }
  `]
})
export class AiuiComponent implements OnInit, AfterViewInit {
  @ViewChild('play')
  play: ElementRef<HTMLDivElement>;

  aiui: AIUI;
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
      this.recordSubscription = this.aiui.record(buffer => {
        this.aiui.iat(buffer)
          .pipe(
            map(output => JSON.parse(output)),
            map(args => {
              this.rxbus.post(args.tag, args.payload);
              switch (args.tag) {
                case 'magneto':
                  return '正在搜索，请稍候。';
                default:
                  return '正在处理，请稍候。';
              }
            }),
            catchError(() => of('这个没听清呢，请你说出要搜索内容哦。'))
          )
          .subscribe(answer => {
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
