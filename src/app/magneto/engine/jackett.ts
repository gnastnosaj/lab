import * as moment from 'moment';
import prettyBytes from 'pretty-bytes';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Magneto } from '../magneto';
import { Engine } from './engine';

export class EngineImpl extends Engine {
    magneto(keyword: string, index?: number): Promise<Magneto> {
        let task: Observable<any>
        if (this.cache[keyword]) {
            task = of(this.cache[keyword])
        } else {
            task = this.http
                .get(
                    `https://jackett.jasontsang.dev:4096/api/v2.0/indexers/all/results`
                    + `?apikey=fcbib0dfobjrhquzvyt765k4chchdt2x&Query=${encodeURIComponent(keyword)}`
                )
                .pipe(
                    map((data: any) => data.Results
                        .filter(result => result.MagnetUri || result.Link)
                        .map(result => ({
                            title: result.Title,
                            magnet: result.MagnetUri || result.Link,
                            size: prettyBytes(result.Size),
                            files: result.Files,
                            addTime: moment(result.PublishDate).format('YYYY-MM-DD'),
                            popularity: result.Grabs
                        }))),
                    tap((data: any) => this.cache[keyword] = data)
                ) as Observable<any>;
        }
        index = index != null ? index : 1;
        const size = 20;
        return task.pipe(
            map((data: any) => ({
                data: data.slice((index - 1) * size, index * size),
                page: {
                    total: data.length,
                    size,
                    index
                }
            } as Magneto))
        ).toPromise();
    }
}
