import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import isElectron from 'is-electron';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    private proxy = 'https://www.jasontsang.dev/proxy/?url=';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isElectron() && req.url.includes(this.proxy)) {
            return next.handle(req.clone({
                url: decodeURIComponent(req.url.slice(this.proxy.length))
            }));
        } else {
            return next.handle(req);
        }
    }
}
