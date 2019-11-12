import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    private proxy = 'https://www.jasontsang.dev/proxy/?url=';
    private force = 'force=true';

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(this.proxy) && !req.url.includes(this.force)) {
            return next.handle(req.clone({
                url: decodeURIComponent(req.url.slice(this.proxy.length))
            }));
        } else {
            return next.handle(req);
        }
    }
}
