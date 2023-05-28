import { BehaviorSubject, Subscription } from 'rxjs';

const theme: BehaviorSubject<string> = new BehaviorSubject(null);

const themes: Array<string> = [];

const registerThemes = (...themesToRegister: Array<string>) => {
    themes.push(...themesToRegister);
    if (theme.value == null) {
        theme.next(themesToRegister[0]);
        theme.subscribe(c => {
            themes.forEach(t => {
                if (t === c) {
                    document.body.classList.add(t);
                } else {
                    document.body.classList.remove(t);
                }
            });
        });
    }
};

const Theme = (property: string) =>
    (target) => {
        Object.defineProperty(target.prototype, property, {
            get: () => theme.value,
            set: (value: string) => {
                theme.next(value);
            }
        });
    };
;

export {
    registerThemes,
    Theme,
    theme
};

import { Directive, ElementRef, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appTheme]'
})
export class ThemeDirective implements OnDestroy {
    subscription: Subscription;

    constructor(el: ElementRef) {
        this.subscription = theme.subscribe(c => {
            themes.forEach(t => {
                if (t === c) {
                    el.nativeElement.classList.add(t);
                } else {
                    el.nativeElement.classList.remove(t);
                }
            });
        });
    }

    ngOnDestroy(): void {
        if (this.subscription != null && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }
}
