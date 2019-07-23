import { Component, Injector, NgZone } from '@angular/core';
import { Router, RouterEvent, NavigationStart } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter, catchError } from 'rxjs/operators';

import { Theme, theme, registerThemes } from './theme.core';
import 'less';
import { RxBus } from './rxbus';
import { HttpClient } from '@angular/common/http';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  template: `
    <div class="splash" *ngIf="!styles.fuchisa">
      <div [ngStyle]="{'transform': transform}">
        <app-lottie path="assets/lottie/loading.line.contrast.{{currentTheme}}.json"></app-lottie>
      </div>
      <div class="placeholder"></div>
      <img src="assets/images/favicon.png">
      <div class="placeholder">
        <app-lottie path="assets/lottie/loading.json"></app-lottie>
      </div>
    </div>
    <ng-container *ngIf="styles.fuchisa">
      <main *ngIf="!loading"><router-outlet></router-outlet></main>
      <div class="loading" *ngIf="loading">
        <app-lottie
          path="assets/lottie/loading.circle.{{currentTheme}}.json"
          [ngStyle]="{'width.px': '64', 'height.px': '64'}">
        </app-lottie>
      </div>
      <header appTheme>
        <div class="left"></div>
        <nz-dropdown [nzTrigger]="'click'">
          <span nz-dropdown class="title">
            <img src="assets/images/favicon.png" />
            Jason Tsang's Lab
            <i nz-icon nzType="down" nzTheme="outline"></i>
          </span>
          <ul nz-menu nzSelectable>
            <li nz-menu-item  *ngFor="let menu of menus" (click)="this.router.navigateByUrl(menu.path);">
              <a>{{menu.title}}</a>
            </li>
          </ul>
        </nz-dropdown>
        <div class="right">
          <nz-dropdown>
            <button class="theme" nz-button [nzSize]="'small'" nz-dropdown><span>{{currentTheme}}</span><i nz-icon type="down"></i></button>
            <ul nz-menu>
              <li nz-menu-item *ngFor="let theme of themes" (click)="changeTheme(theme)">
                <a>{{theme}}</a>
              </li>
            </ul>
          </nz-dropdown>
        </div>
      </header>
    </ng-container>
  `,
  styles: [`
    .splash > div:first-of-type {
      position: fixed;
      top: 0px;
      width: 100vw;
      height: 2px;
      overflow: hidden;
    }

    .splash > div:first-of-type ::ng-deep svg {
      width: 100vw !important;
      height: 100px !important;
      margin-top: -50px;
    }

    .splash > div:last-of-type {
      width: 100px;
    }

    .splash > .placeholder {
      flex: 1;
    }

    header {
      position: fixed;
      top: 0px;
      width: 100vw;
      height: 36px;
      background: #535353;
      color: #d6d6d6;
      user-select: none;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    header .title {
      color: #ed1d7f;
      font-size: 16px;
      padding-left: 12px;
      padding-right: 12px;
    }

    header.mojave .title {
      color: #dcbc7f;
    }

    header .title img {
      width: 24px;
      height: 24px;
      margin-top: -8px;
    }

    header .title i {
      margin-left: 0px;
    }

    header div {
      flex: 1;
    }

    header div.right {
      text-align: right;
      padding-right: 8px;
    }

    main {
      width: 100vw;
      min-height: 100vh;
      padding-top: 36px;
      position: relative;
    }

    .loading {
      width: 100vw;
      height: 100vh;
      padding-top: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
@Theme('currentTheme')
export class AppComponent {
  themes = ['fuchisa', 'mojave'];
  styles: {
    [propName: string]: string;
  } = {};
  style = null;
  transform = `scaleX(${document.body.clientWidth / 60})`;
  loading = false;

  menus = [{
    title: 'Meizhi',
    path: 'meizhi'
  }, {
    title: 'Magneto',
    path: 'magneto'
  }];

  recording: Subscription;

  constructor(public router: Router, private injector: Injector) {
    const global = window as any;
    if (global.nodeRequire) {
      import('./aiui/aiui').then(module => {
        const aiui = Injector.create({
          providers: [
            { provide: module.AIUI, deps: [RxBus, NgZone, HttpClient, Overlay] }
          ],
          parent: this.injector
        }).get(module.AIUI);

        aiui.attach();
      });
    }

    const onresize = global.onresize;
    global.onresize = ev => {
      if (onresize instanceof Function) {
        onresize.call(onresize, ev);
      }
      this.transform = `scaleX(${document.body.clientWidth / 60})`;
    };

    (this.router.events.pipe(
      filter(event => event instanceof RouterEvent)
    ) as Observable<RouterEvent>).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    });

    registerThemes(...this.themes);

    let subscription: Subscription;
    theme.subscribe(t => {
      if (subscription != null && !subscription.closed) {
        subscription.unsubscribe();
      }
      if (this.style == null) {
        this.style = document.createElement('style');
        this.style.setAttribute('type', 'text/css');
        document.head.appendChild(this.style);
      }
      if (this.styles[t]) {
        this.style.innerHTML = this.styles[t];
      } else {
        let render = new Observable<string>(observer => {
          less.render(`@import "theme/${t}.less";`, {
            javascriptEnabled: true
          }).then(output => {
            observer.next(output.css);
          });
          return { unsubscribe() { } };
        });
        if (typeof Worker !== 'undefined') {
          const temp = render;
          render = new Observable<string>(observer => {
            const worker = new Worker('./theme.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
              observer.next(data.css);
              observer.complete();
            };
            worker.onerror = error => {
              observer.error(error);
            };
            worker.postMessage(t);
            return {
              unsubscribe() {
                worker.terminate();
              }
            };
          }).pipe(
            catchError(() => temp)
          );
        }
        subscription = render.subscribe(css => {
          this.style.innerHTML = css;
          this.styles[t] = css;
        });
      }
    });
  }

  changeTheme(newTheme: string) {
    theme.next(newTheme);
  }
}
