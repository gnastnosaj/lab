import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Engine } from './engine';
import { Magneto } from '../magneto';
import { Page } from '../page';

export class EngineImpl extends Engine {
    magneto(keyword: string, index?: number): Observable<Magneto> {
        return this.http.get(`https://www.jasontsang.dev:4096/proxy/?url=${encodeURIComponent(
            `https://btdb.io/?s=${encodeURIComponent(keyword)}${index == null ? '' : `&page=${index}`}`
        )}`, { responseType: 'text' })
            .pipe(
                map(html => $.parseHTML(html)),
                map(document => {
                    const data = [];
                    $(document).find('li.search-ret-item').each((_, item) => {
                        const title = $(item).find('.item-title a').attr('title').trim();
                        const magnet = $(item).find('.item-meta-info a.magnet').attr('href');
                        const details = $(item).find('.item-meta-info span.item-meta-info-value');
                        const size = $(details[0]).text();
                        const files = $(details[1]).text();
                        const addTime = $(details[2]).text();
                        if (magnet) {
                            data.push({
                                title,
                                magnet,
                                size,
                                files,
                                addTime
                            });
                        }
                    });

                    const page: Page = {
                        total: 100,
                        index: 1,
                        previous: `https://www.jasontsang.dev:4096/proxy/?url=${encodeURIComponent(
                            `https://btdb.io/?s=${encodeURIComponent(keyword)}${index == null ? '' : `&page=${index - 1}`}`
                        )}`,
                        next: `https://www.jasontsang.dev:4096/proxy/?url=${encodeURIComponent(
                            `https://btdb.io/?s=${encodeURIComponent(keyword)}${index == null ? '' : `&page=${index + 1}`}`
                        )}`
                    };

                    try {
                        page.total = Math.ceil(parseInt($(document).find('div.result-stats').text().trim().split(' ')[1]) / 25);
                    } catch { }

                    const magneto: Magneto = {
                        data,
                        page
                    };

                    return magneto;
                })
            );
    }
}
