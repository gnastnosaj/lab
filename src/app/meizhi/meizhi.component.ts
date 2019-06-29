import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
import { Meizhi } from './meizhi';
import { ApiService } from './api.service';
import * as Masonry from 'masonry-layout';
import * as imagesLoaded from 'imagesloaded';

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

  constructor(private api: ApiService) {
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

    this.mutationObserver = new MutationObserver((mutations) => {
      if (mutations.some(mutation => mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach((node: HTMLElement) => {
            node.style.display = 'none';
            imagesLoaded(node).on('progress', () => {
              node.style.display = 'block';
              this.masonry.appended(node);
              this.masonry.layout();
              this.scroll.refresh();
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
  }
}
