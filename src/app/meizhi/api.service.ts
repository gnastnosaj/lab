import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Meizhi } from './meizhi';

@Injectable()
export class ApiService {
  private modelId = '6424';

  private nsfw: boolean;

  private next: string;

  constructor(private http: HttpClient, private dataPipe: DatePipe) {
  }

  refresh(): Observable<Meizhi[]> {
    this.nsfw = window.location.href.includes('nsfw=true');
    if (this.nsfw) {
      this.next = this.proxy(`https://civitai.com/api/v1/images?modelId=${this.modelId}&sort=Most%20Comments`);
    } else {
      this.next = this.proxy(`https://civitai.com/api/v1/images?modelId=${this.modelId}&sort=Most%20Comments&nsfw=None`);
    }
    return this.loadMore();
  }

  loadMore(): Observable<Meizhi[]> {
    return this.http
      .get(this.next)
      .pipe(
        map((data: any) => {
          const meizhis: Meizhi[] = [];
          data?.items?.forEach(item => {
            const meizhi = new Meizhi();
            meizhi.title = this.dataPipe.transform(item.createdAt, 'yyyy-MM-dd HH:mm:ss');
            meizhi.links.push(this.proxy(item.url));
            meizhis.push(meizhi);
          });
          this.next = this.proxy(data?.metadata?.nextPage);
          return meizhis;
        })
      );
  }

  hasMore(): boolean {
    return this.next != null;
  }

  proxy(url: string): string {
    if (!url) {
      return null;
    }
    return `https://bypass.jasontsang.dev:4096/${url}`;
  }
}
