import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { Magneto } from './magneto';

const SystemJS = (window as any).System;

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) {
    }

    magneto(keyword: string, index?: number): Observable<Magneto> {
        return new Observable<any>(subscriber => {
            SystemJS
                .import('./magneto/engine/engine.js')
                .then(module => {
                    subscriber.next(module.Engine);
                    subscriber.complete();
                })
                .catch(error => subscriber.error(error));
        }).pipe(
            flatMap(Engine => {
                const providers = [...Engine.providers];

                const createEngine = () => new Observable<any>(subscriber => {
                    const provider = providers.shift();
                    if (provider == null) {
                        subscriber.complete();
                    } else {
                        SystemJS
                            .import(`./magneto/engine/${provider}.js`)
                            .then(module => {
                                subscriber.next(new module.EngineImpl(this.http));
                                subscriber.complete();
                            })
                            .catch(error => subscriber.error(error));
                    }
                    return { unsubscribe: () => { } };
                });

                const createTask: () => Observable<Magneto> = () => createEngine().pipe(
                    flatMap(engine => engine.magneto(keyword, index) as Observable<Magneto>),
                    catchError(error => {
                        console.log(error);
                        return createTask();
                    })
                );
                return createTask();
            })
        );
    }
}
