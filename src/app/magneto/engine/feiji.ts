import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Engine } from './engine';
import { Magneto } from '../magneto';
import { Page } from '../page';

export class EngineImpl extends Engine {
    magneto(keyword: string, index?: number): Observable<Magneto> {
        let observable: Observable<string> = null;
        if (index == null) {
            const body = new FormData();
            body.append('keyword', keyword);
            observable = this.http
                .post(`https://www.jasontsang.dev/proxy/?url=${encodeURIComponent('http://feijibtba.life')}`, body, {
                    responseType: 'text'
                });
        } else {
            observable = this.http.get(`https://www.jasontsang.dev/proxy/?url=${encodeURIComponent(
                `http://feijibtba.live/list/${encodeURIComponent(keyword)}/${index}/0/0.html`
            )}`, { responseType: 'text' });
        }
        return observable.pipe(
            map(html => $.parseHTML(html)),
            map(document => {
                const sections = $(document).find('div.pbox');
                const data = [];
                $(sections[sections.length - 1]).find('div.rs').each((_, item) => {
                    const title = $(item).find('div.title').text().trim();
                    const magnet = $(item).find('div.sbar a').attr('href');
                    const details = $(item).find('div.sbar b');
                    const size = $(details[1]).text();
                    const files = $(details[2]).text();
                    const addTime = $(details[0]).text();
                    const popularity = $(details[3]).text();
                    if (magnet) {
                        data.push({
                            title,
                            magnet,
                            size,
                            files,
                            addTime,
                            popularity
                        });
                    }
                });

                const page: Page = {
                    total: 1,
                    index: 1
                };
                const pagers = $(document).find('div.pager');
                if (
                    pagers.length > 0
                ) {
                    const pager = pagers[0];
                    let total = $($(pager).find('span')[0]).text();
                    total = total.slice(1, total.length - 1);
                    page.total = parseInt(total, null);
                    page.index = parseInt($($(pager).find('span')[1]).text(), null);
                    const hrefs = $(pager).find('a');
                    if (hrefs.length > 0) {
                        if (isNaN(parseInt($(hrefs[0]).text(), null))) {
                            page.previous = $(hrefs[0]).attr('href');
                        }
                        if (isNaN(parseInt($(hrefs[hrefs.length - 1]).text(), null))) {
                            page.next = $(hrefs[hrefs.length - 1]).attr('href');
                        }
                    }
                }
                const magneto: Magneto = {
                    data,
                    page
                };
                return magneto;
            })
        );
    }
}
