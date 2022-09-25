import * as moment from 'moment';
import prettyBytes from 'pretty-bytes';
import { Observable, of, zip } from 'rxjs';
import { catchError, flatMap, map, tap } from 'rxjs/operators';
import { Magneto } from '../magneto';
import { Engine } from './engine';

export class EngineImpl extends Engine {
    cache: {
        [keyword: string]: Magneto;
    } = {};

    magneto(keyword: string, index?: number): Observable<Magneto> {
        if (this.cache[keyword]) {
            return of(this.cache[keyword]);
        }
        return this.http
            .get(
                `https://jackett.jasontsang.dev:4096/api/v2.0/indexers/all/results?
                Query=${encodeURIComponent(keyword)}&apikey=fcbib0dfobjrhquzvyt765k4chchdt2x&
                Tracker%5B%5D=acgsou&Tracker%5B%5D=acgrip&Tracker%5B%5D=btmirror&
                Tracker%5B%5D=freshmeat&Tracker%5B%5D=0magnet&Tracker%5B%5D=solidtorrents`
            )
            .pipe(
                map((data: any) => ({
                    data: data.Results
                        .filter(result => result.MagnetUri || result.Link)
                        .map(result => ({
                            title: result.Title,
                            magnet: result.MagnetUri || result.Link,
                            size: prettyBytes(result.Size),
                            files: result.Files,
                            addTime: moment(result.PublishDate).format('YYYY-MM-DD'),
                            popularity: result.Grabs
                        })),
                    page: {
                        total: 1,
                        index: 1
                    }
                } as Magneto)),
                flatMap(magneto =>
                    zip(...magneto.data.map(item =>
                        item.magnet.startsWith('http') ?
                            this.http
                                .get(`https://bypass.jasontsang.dev:4096/${item.magnet}`, { responseType: 'text' })
                                .pipe(
                                    tap(uri => item.magnet = uri),
                                    catchError(() => of(item.magnet))
                                ) :
                            of(item.magnet))
                    ).pipe(
                        map(() => magneto)
                    )
                )
            );
    }
}
