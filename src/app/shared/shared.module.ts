import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from '../theme.core';
import { LottieComponent } from '../lottie/lottie.component';

@NgModule({
    declarations: [
        ThemeDirective,
        LottieComponent
    ],
    imports: [CommonModule],
    exports: [ThemeDirective, LottieComponent]
})
export class SharedModule { }
