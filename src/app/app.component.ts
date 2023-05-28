import { HttpClient } from '@angular/common/http';
import { Component, Injector } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { catchError, filter, throttleTime } from 'rxjs/operators';
import { getOS } from 'simple-os-platform';
import { RxBus } from './rxbus';
import { registerThemes, Theme, theme } from './theme.core';

@Component({
  selector: 'app-root',
  template: `
    <div class="splash" *ngIf="!styles['fuchisa']">
      <div [ngStyle]="{'transform': transform}">
        <app-lottie path="assets/lottie/loading.line.contrast.{{this['currentTheme']}}.json"></app-lottie>
      </div>
      <div class="placeholder"></div>
      <img src="assets/images/favicon.png">
      <div class="placeholder">
        <app-lottie path="assets/lottie/loading.json"></app-lottie>
      </div>
    </div>
    <ng-container *ngIf="styles['fuchisa']">
      <main *ngIf="!loading"><router-outlet></router-outlet></main>
      <div class="loading" *ngIf="loading">
        <app-lottie
          path="assets/lottie/loading.circle.{{this['currentTheme']}}.json"
          [ngStyle]="{'width.px': '64', 'height.px': '64'}">
        </app-lottie>
      </div>
      <header appTheme>
        <div class="left"></div>
        <img src="assets/images/favicon.png" (click)="rxbus.send('blockly')">
        <span nz-dropdown [nzTrigger]="'click'" [nzDropdownMenu]="menu" class="title">
          Jason Tsang's Lab
          <i nz-icon nzType="down" nzTheme="outline"></i>
        </span>
        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu nzSelectable>
            <li nz-menu-item  *ngFor="let menu of menus" (click)="this.router.navigateByUrl(menu.path);">
              <a>{{menu.title}}</a>
            </li>
          </ul>
        </nz-dropdown-menu>
        <div class="right">
          <button class="theme" nz-button [nzSize]="'small'" nz-dropdown [nzDropdownMenu]="theme">
            <span>{{this['currentTheme']}}</span><i nz-icon nzType="down"></i>
          </button>
          <nz-dropdown-menu #theme="nzDropdownMenu">
            <ul nz-menu>
              <li nz-menu-item *ngFor="let theme of themes" (click)="changeTheme(theme)">
                <a>{{theme}}</a>
              </li>
            </ul>
          </nz-dropdown-menu>
        </div>
      </header>
      <a appTheme *ngIf="platform !== 'electron'" (click)="desktop()" class="github-corner" aria-label="Get Jason Tsang's Lab Desktop">
        <svg width="54" height="54" viewBox="0 0 250 250" aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3
            C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm">
          </path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4
            143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6
            187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6
            C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5
            C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body">
          </path>
        </svg>
      </a>
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

    header img {
      width: 24px;
      height: 24px;
      margin-top: -8px;
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

    .github-corner svg {
      z-index: 1;
      fill: #ed1d7f;
      color: #fff;
      position: fixed;
      top: 0;
      border: 0;
      left: 0;
      transform: scale(-1, 1);
    }

    .github-corner.mojave svg {
      fill: #dcbc7f;
    }

    .github-corner:hover .octo-arm {
      animation: octocat-wave 560ms ease-in-out
    }

    @keyframes octocat-wave {
        0%,
        100% {
            transform: rotate(0)
        }

        20%,
        60% {
            transform: rotate(-25deg)
        }

        40%,
        80% {
            transform: rotate(10deg)
        }
    }

    @media (max-width:500px) {
        .github-corner:hover .octo-arm {
            animation: none
        }

        .github-corner .octo-arm {
            animation: octocat-wave 560ms ease-in-out
        }
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
  platform = null;

  menus = [{
    title: 'Meizhi',
    path: 'meizhi'
  }, {
    title: 'Magneto',
    path: 'magneto'
  }];

  recording: Subscription;

  constructor(public router: Router, private injector: Injector, private http: HttpClient, public rxbus: RxBus) {
    const global = window as any;
    if (global.nodeRequire) {
      this.platform = 'electron';
    } else {
      this.platform = getOS();
    }

    import(/* webpackChunkName: "aiui" */ './cognitive/Cognitive').then(module => {
      const aiui = this.injector.get(module.Cognitive);;

      aiui.attach();

      let previousScrollTop = $(document).scrollTop();

      new Observable(subscriber => {
        window.addEventListener('scroll', event => {
          subscriber.next(event);
        });
      })
        .pipe(
          throttleTime(200)
        )
        .subscribe(() => {
          const currentScrollTop = $(document).scrollTop();
          if (currentScrollTop > previousScrollTop) {
            aiui.dettach();
          } else {
            aiui.attach();
          }
          previousScrollTop = currentScrollTop;
        });
    });

    import(/* webpackChunkName: "blockly" */ './blockly/blockly').then(module => {
      const blockly = this.injector.get(module.Blockly);;

      this.rxbus.toObserverable().subscribe(event => {
        if (event === 'blockly') {
          blockly.attach();
        }
      });
    });

    const onresize = global.onresize;
    global.onresize = event => {
      if (onresize instanceof Function) {
        onresize.call(onresize, event);
      }
      this.transform = `scaleX(${document.body.clientWidth / 60})`;
      this.rxbus.post('resize', event);
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
        let remedy = new Observable<string>(observer => {
          import('less')
            .then(less => {
              less.render(`@import "theme/${t}.less";`, {
                javascriptEnabled: true
              }).then(output => {
                observer.next(output.css);
              }).catch(error => observer.error(error));
            })
            .catch(error => observer.error(error));
          return { unsubscribe: () => { } };
        });
        if (typeof Worker !== 'undefined') {
          const temp = remedy;
          remedy = new Observable<string>(observer => {
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
              unsubscribe: () => {
                worker.terminate();
              }
            };
          }).pipe(
            catchError(() => temp)
          );
        }
        let render = this.http.get(`assets/styles/${t}.css`, {
          responseType: 'text'
        }).pipe(
          catchError(() => remedy)
        );
        if (global.nodeRequire) {
          render = remedy;
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

  desktop() {
    window.open('https://github.com/gnastnosaj/lab/releases');
  }
}
