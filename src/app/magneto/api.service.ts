import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { flatMap, catchError, timeout } from 'rxjs/operators';

import { Engine } from './engine/engine';
import { Magneto } from './magneto';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    magneto(keyword: string, index?: number): Observable<Magneto> {
        return of([...Engine.providers]).pipe(
            flatMap(providers => {
                const createEngine = () => {
                    return new Observable<Engine>(observer => {
                        const provider = providers.shift();
                        if (provider == null) {
                            observer.complete();
                        } else {
                            import(`./engine/${provider}`)
                                .then(module => {
                                    observer.next(new module.EngineImpl(this.http));
                                    observer.complete();
                                })
                                .catch(e => {
                                    observer.error(e);
                                });
                        }
                        return { unsubscribe() { } };
                    });
                };

                let createTask: () => Observable<Magneto>;
                createTask = () => createEngine().pipe(
                    flatMap(engine => engine.magneto(keyword, index)),
                    timeout(5000),
                    catchError(() => createTask())
                );
                return createTask();
            })
        );
    }
}
