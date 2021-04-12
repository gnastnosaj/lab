import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Meizhi } from './meizhi';

@Injectable()
export class ApiService {

  private next: string;

  constructor(private http: HttpClient) { }

  refresh(): Observable<Meizhi[]> {
    this.next = 'http://jandan.net/ooxx';
    return this.loadMore();
  }

  loadMore(): Observable<Meizhi[]> {
    return this.http
      .get(`https://www.jasontsang.dev:4096/proxy/?url=${encodeURIComponent(this.next)}`, { responseType: 'text' })
      .pipe(
        map(html => $.parseHTML(html)),
        map(document => {
          const meizhis: Meizhi[] = [];
          $(document).find('ol.commentlist li').each((_, item) => {
            const meizhi = new Meizhi();
            meizhi.title = $(item).find('div.author').text().trim();
            if (meizhi.title !== null && meizhi.title !== '') {
              $(item).find('div.text a.view_img_link').each((__, link) => {
                meizhi.links.push(`http:${$(link).attr('href')}`);
              });
              meizhis.push(meizhi);
            }
          });
          this.next = $(document).find('div.cp-pagenavi a.previous-comment-page').attr('href');
          if (this.next !== null && this.next !== '') {
            this.next = `http:${this.next}`;
          }
          return meizhis;
        })
      );
  }

  hasMore(): boolean {
    return this.next != null;
  }
}
