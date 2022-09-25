import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Magneto } from '../magneto';

export abstract class Engine {
    static providers = ['jackett'];
    constructor(protected http: HttpClient) { }
    abstract magneto(keyword: string, index?: number): Observable<Magneto>;
}
