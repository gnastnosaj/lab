import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './cors-interceptor';
import { ThemeDirective } from '../theme.core';
import { LottieComponent } from '../lottie/lottie.component';
import isElectron from 'is-electron';

@NgModule({
    declarations: [
        ThemeDirective,
        LottieComponent
    ],
    imports: [CommonModule, HttpClientModule],
    exports: [ThemeDirective, LottieComponent],
    providers: [
        ...(isElectron() ? [{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true }] : [])
    ]
})
export class SharedModule { }
