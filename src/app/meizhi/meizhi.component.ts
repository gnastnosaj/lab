import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { Meizhi } from './meizhi';
import { ApiService } from './api.service';
import * as Masonry from 'masonry-layout';
import * as imagesLoaded from 'imagesloaded';
import { RxBus } from '../rxbus';
import { Observable, Subscription, of } from 'rxjs';
import { throttleTime, tap, delay, repeat, flatMap } from 'rxjs/operators';

BScroll.use(PullDown);
BScroll.use(Pullup);

@Component({
  selector: 'app-meizhi',
  templateUrl: './meizhi.component.html',
  styleUrls: ['./meizhi.component.less']
})
export class MeizhiComponent implements OnInit, OnDestroy {
  data: Meizhi[] = [];
  refreshing = false;
  loading = false;

  @ViewChild('scrollable', { static: true })
  scrollable: ElementRef<HTMLDivElement>;

  @ViewChild('waterfall', { static: true })
  waterfall: ElementRef<HTMLDivElement>;

  scroll: BScroll;
  masonry: Masonry;
  mutationObserver: MutationObserver;
  scrollObserver: Observable<BScroll>;
  subscription = new Subscription();

  constructor(private api: ApiService, private rxbus: RxBus) {
  }

  ngOnInit() {
    this.scroll = new BScroll(this.scrollable.nativeElement, {
      scrollY: true,
      pullDownRefresh: true,
      pullUpLoad: true,
      preventDefaultException: {
        className: /(^|\s)item(\s|$)/
      },
      click: true
    }).on('scroll', () => {
      if (!this.loading && this.waterfall.nativeElement.clientHeight < this.scrollable.nativeElement.clientHeight) {
        this.loading = true;
        this.api.loadMore().subscribe(data => {
          this.data.push(...data);
          this.loading = false;
        });
      }
      this.rxbus.post('scroll', this.scroll);
    }).on('pullingDown', () => {
      this.refreshing = true;
      this.api.refresh().subscribe(data => {
        this.data = data;
        this.refreshing = false;
        this.scroll.finishPullDown();
      });
    }).on('pullingUp', () => {
      if (this.api.hasMore()) {
        this.loading = true;
        this.api.loadMore().subscribe(data => {
          this.data.push(...data);
          this.loading = false;
          this.scroll.finishPullUp();
        });
      }
    });

    this.masonry = new Masonry(this.waterfall.nativeElement, {
      itemSelector: '.item',
      hiddenStyle: {
        transform: 'translateY(100px)',
        opacity: 0
      },
      visibleStyle: {
        transform: 'translateY(0px)',
        opacity: 1
      }
    });

    this.mutationObserver = new MutationObserver(mutations => {
      if (mutations.some(mutation => mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
        mutations.forEach(mutation => {
          const states = [];
          mutation.addedNodes.forEach((node: HTMLElement) => {
            node.style.display = 'none';
            imagesLoaded(node).on('progress', (_, image) => {
              states.push({
                node,
                image
              });
              if (states.length === mutation.addedNodes.length) {
                states.forEach(state => {
                  if (state.image.isLoaded) {
                    state.node.style.display = 'block';
                    this.masonry.appended(node);
                  }
                });
                this.masonry.layout();
                this.scroll.refresh();
              }
            });
          });
          mutation.removedNodes.forEach(node => {
            this.masonry.remove(node);
          });
        });
      }
    });
    this.mutationObserver.observe(this.waterfall.nativeElement, {
      childList: true
    });

    this.scrollObserver = this.rxbus.register('scroll');
    this.subscription.add(
      this.scrollObserver
        .pipe(
          throttleTime(1000),
          flatMap(data => {
            return of(data)
              .pipe(
                tap(() => {
                  $('div.waterfall div.item').each((_, item) => {
                    const element = this.scrollable.nativeElement;
                    if (item.offsetTop + item.offsetHeight + this.scroll.y + window.screen.height < element.offsetTop || item.offsetTop + this.scroll.y - window.screen.height > element.offsetTop + element.offsetHeight) {
                      item.style.visibility = 'hidden';
                    } else {
                      item.style.visibility = 'visible';
                    }
                  });
                }),
                delay(500),
                repeat(3)
              );
          })
        )
        .subscribe()
    );

    this.refreshing = true;
    this.api.refresh().subscribe(data => {
      this.data = data;
      this.refreshing = false;
    });
  }

  show(meizhi: Meizhi) {
    $.fancybox.open(
      meizhi.links.map(link => {
        return {
          src: link
        };
      }),
      {
        arrows: false,
        buttons: [
          'download',
          'thumbs',
          'close'
        ]
      }
    );
  }

  ngOnDestroy() {
    if (this.masonry != null) {
      this.masonry.destroy();
    }
    if (this.scroll != null) {
      this.scroll.destroy();
    }
    if (this.mutationObserver != null) {
      this.mutationObserver.disconnect();
    }
    if (this.scrollObserver != null) {
      this.rxbus.unregister('scroll', this.scrollObserver);
    }
    this.subscription.unsubscribe();
  }
}
