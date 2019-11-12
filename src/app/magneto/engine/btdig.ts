import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Engine } from './engine';
import { Magneto } from '../magneto';
import { Page } from '../page';

export class EngineImpl extends Engine {
    magneto(keyword: string, index?: number): Observable<Magneto> {
        return this.http.get(`https://www.jasontsang.dev/proxy/?url=${encodeURIComponent(
            `http://btdig.com/search?q=${encodeURIComponent(keyword)}&p=${index == null ? 0 : index - 1}&order=0`
        )}&force=true`, { responseType: 'text' })
            .pipe(
                map(html => $.parseHTML(html)),
                map(document => {
                    const data = [];
                    $(document).find('div.one_result').each((_, item) => {
                        const title = $(item).find('div.torrent_name').text().trim();
                        const magnet = $(item).find('div.torrent_magnet a').attr('href');
                        const size = $(item).find('span.torrent_size').text();
                        const files = $(item).find('span.torrent_files').text();
                        const addTime = $(item).find('span.torrent_age').text();
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
                        previous: `http://btdig.com/search?q=${encodeURIComponent(keyword)}&p=${index == null ? 0 : index - 2}&order=0`,
                        next: `http://btdig.com/search?q=${encodeURIComponent(keyword)}&p=${index == null ? 0 : index}&order=0`
                    };

                    try {
                        page.total = Math.ceil(parseInt($(document).find('form+div span').text().trim().split(' ')[0]) / 10);
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
