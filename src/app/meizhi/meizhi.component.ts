import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import MouseWheel from '@better-scroll/mouse-wheel';
import * as imagesLoaded from 'imagesloaded';
import * as Masonry from 'masonry-layout';
import { Observable, of, Subscription } from 'rxjs';
import { delay, flatMap, repeat, tap, throttleTime } from 'rxjs/operators';
import { RxBus } from '../rxbus';
import { ApiService } from './api.service';
import { Meizhi } from './meizhi';
import { ActivatedRoute } from '@angular/router';

BScroll.use(PullDown);
BScroll.use(Pullup);
BScroll.use(MouseWheel);

@Component({
  selector: 'app-meizhi',
  templateUrl: './meizhi.component.html',
  styleUrls: ['./meizhi.component.less']
})
export class MeizhiComponent implements OnInit, OnDestroy {
  @ViewChild('scrollable', { static: true })
  scrollable: ElementRef<HTMLDivElement>;

  @ViewChild('waterfall', { static: true })
  waterfall: ElementRef<HTMLDivElement>;

  data: Meizhi[] = [];
  refreshing = false;
  loading = false;
  layout = false;
  refreshSubscription: Subscription;

  scroll: BScroll;
  masonry: any;
  mutationObserver: MutationObserver;
  scrollObserver: Observable<BScroll>;
  resizeObserver: Observable<any>;
  subscription = new Subscription();

  constructor(private api: ApiService, private rxbus: RxBus, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.scroll = new BScroll(this.scrollable.nativeElement, {
      scrollY: true,
      pullDownRefresh: true,
      pullUpLoad: true,
      preventDefaultException: {
        className: /(^|\s)item(\s|$)/
      },
      click: true,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    })
      .on('scroll', () => {
        if (!this.loading && this.waterfall.nativeElement.clientHeight < this.scrollable.nativeElement.clientHeight) {
          this.loading = true;
          this.api.loadMore().subscribe(data => {
            this.data.push(...data);
            this.loading = false;
          });
        }
        this.rxbus.post('scroll', this.scroll);
      })
      .on('pullingDown', () => this.refresh())
      .on('pullingUp', () => {
        if (this.api.hasMore()) {
          this.loading = true;
          this.api.loadMore().subscribe(data => {
            this.data.push(...data);
            this.loading = false;
            this.scroll['finishPullUp']();
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
          const states: any = [];
          mutation.addedNodes.forEach((node: Node) => {
            (node as HTMLElement).style.display = 'none';
            imagesLoaded(node as HTMLElement).on('progress', (_, image) => {
              states.push({
                node,
                image
              });
              if (states.length === mutation.addedNodes.length) {
                states.forEach(state => {
                  if (state.image.isLoaded) {
                    state.node.style.display = '';
                  }
                });
                this.masonry.appended(states.filter(state => state.image.isLoaded).map(state => state.node));
                if (this.layout) {
                  this.masonry.layout();
                  this.layout = false;
                }
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
          flatMap(data =>
            of(data)
              .pipe(
                tap(() => {
                  $('div.waterfall div.item').each((_, item) => {
                    const element = this.scrollable.nativeElement;
                    if (
                      item.offsetTop + item.offsetHeight + this.scroll.y + window.screen.height < element.offsetTop ||
                      item.offsetTop + this.scroll.y - window.screen.height > element.offsetTop + element.offsetHeight
                    ) {
                      if (item.style.display === '' || item.style.display === 'block') {
                        const img = item.children[0] as HTMLImageElement;
                        img.style.display = 'none';
                        item.style.height = `${(img.height * item.offsetWidth / img.width
                          + (item.children[1] as HTMLElement).offsetHeight).toFixed()}px`;
                      }
                    } else {
                      if (item.style.display === '' || item.style.display === 'block') {
                        item.style.height = '';
                        (item.children[0] as HTMLElement).style.display = '';
                      }
                    }
                  });
                }),
                delay(500),
                repeat(3)
              )
          )
        )
        .subscribe()
    );

    this.resizeObserver = this.rxbus.register('resize');
    this.subscription.add(
      this.resizeObserver
        .pipe(
          throttleTime(1000),
          flatMap(data =>
            of(data)
              .pipe(
                tap(() => {
                  $('div.waterfall div.item').each((_, item) => {
                    const img = item.children[0] as HTMLImageElement;
                    if (img.style.display === 'none') {
                      item.style.height = `${(img.height * item.offsetWidth / img.width
                        + (item.children[1] as HTMLElement).offsetHeight).toFixed()}px`;
                    }
                  });
                  this.masonry.layout();
                  this.scroll.refresh();
                  this.rxbus.post('scroll', this.scroll);
                }),
                delay(500),
                repeat(2)
              )
          )
        )
        .subscribe()
    );

    this.activatedRoute.params.subscribe(() => {
      this.refresh();
    });
  }

  refresh() {
    this.refreshing = true;
    if (this.refreshSubscription != null && !this.refreshSubscription.closed) {
      this.refreshSubscription.unsubscribe();
    }
    this.refreshSubscription = this.api
      .refresh()
      .subscribe(data => {
        this.data = data;
        this.refreshing = false;
        this.layout = true;
      });
  }

  show(meizhi: Meizhi) {
    $.fancybox.open(
      meizhi.links.map(link => ({
        src: link
      })),
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
    if (this.resizeObserver != null) {
      this.rxbus.unregister('resize', this.resizeObserver);
    }
    this.subscription.unsubscribe();
  }
}
