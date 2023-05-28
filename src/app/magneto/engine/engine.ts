import { HttpClient } from '@angular/common/http';

import { Magneto } from '../magneto';

export abstract class Engine {
    static providers = ['jackett'];
    constructor(protected http: HttpClient, protected cache: {
        [keyword: string]: any;
    }) { }
    abstract magneto(keyword: string, index?: number): Promise<Magneto>;
}
