import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Meizhi } from './meizhi';

@Injectable()
export class ApiService {
  private next: string;

  private session = 'lab';

  constructor(private http: HttpClient) { }

  refresh(): Observable<Meizhi[]> {
    this.next = 'http://jandan.net/ooxx';

    return this.http
      .post('https://flaresolverr.jasontsang.dev:4096/v1', {
        cmd: 'sessions.list'
      })
      .pipe(
        flatMap((listResult: any) => {
          if (listResult?.sessions?.some(session => session === this.session)) {
            return of(this.session);
          } else {
            return this.http
              .post('https://flaresolverr.jasontsang.dev:4096/v1', {
                cmd: 'sessions.create',
                session: this.session
              })
              .pipe(
                map((createResult: any) => createResult?.session)
              );
          }
        }),
        flatMap(() => this.loadMore())
      );
  }

  loadMore(): Observable<Meizhi[]> {
    return this.http
      .post('https://flaresolverr.jasontsang.dev:4096/v1', {
        cmd: 'request.get',
        url: this.next,
        session: this.session,
        maxTimeout: 60000
      })
      .pipe(
        map((data: any) => data?.solution?.response),
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
