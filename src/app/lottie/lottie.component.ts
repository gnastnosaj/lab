import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as lottie from 'lottie-web/build/player/lottie';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-lottie',
  template: `
    <div #container [ngStyle]="ngStyle" [ngClass]="ngClass">
    </div>
  `,
  styles: []
})
export class LottieComponent implements OnChanges, OnInit, OnDestroy {

  @ViewChild('container', { static: true })
  container: ElementRef;

  @Input()
  ngStyle: { [key: string]: string }; // Optional

  @Input()
  ngClass: any; // Optional

  @Input()
  path: string; // Required

  @Input()
  renderer = 'svg'; // Required 'svg/canvas/html'

  @Input()
  loop = true; // Optional

  @Input()
  autoplay = true; // Optional

  @Input()
  play?: boolean = null; // Optional

  private anim: any;
  private animationSubject: ReplaySubject<any> = new ReplaySubject(1);

  private progressSubject: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor() { }

  get animation() {
    return this.animationSubject.asObservable();
  }

  get progress() {
    return this.progressSubject.value;
  }
  @Input()
  set progress(progress: number) { // Optional [0, 100]
    this.progressSubject.next(progress);
  }

  ngOnChanges(changes: SimpleChanges) {
    const propNames = ['path', 'renderer', 'loop', 'autoplay'];
    propNames.forEach(propName => {
      if (changes[propName] && !changes[propName].firstChange) {
        this.anim.destroy();
        this.ngOnInit();
      }
    });
    if (changes['play'] && !changes['play'].firstChange) {
      if (changes['play'].currentValue) {
        this.anim.goToAndPlay(this.anim.totalFrames * this.progress / 100, true);
      } else {
        this.anim.goToAndStop(this.anim.totalFrames * this.progress / 100, true);
      }
    }
  }

  ngOnInit() {
    const anim = (lottie as any).loadAnimation({
      container: this.container.nativeElement,
      path: this.path,
      renderer: this.renderer,
      loop: this.loop,
      autoplay: (this.autoplay && (this.play == null || this.play)) || this.play
    });
    let subscription: Subscription;
    anim.addEventListener('DOMLoaded', () => {
      subscription = this.progressSubject.subscribe(progress => {
        const frame = anim.totalFrames * progress / 100;
        if ((this.autoplay && (this.play == null || this.play)) || this.play) {
          anim.goToAndPlay(frame, true);
        } else {
          anim.goToAndStop(frame, true);
        }
      });
      this.animationSubject.next(anim);
    });
    anim.addEventListener('destroy', () => {
      if (subscription != null && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.anim = anim;
  }

  ngOnDestroy(): void {
    this.progressSubject.unsubscribe();
    this.animationSubject.unsubscribe();
    this.anim.destroy();
  }
}
