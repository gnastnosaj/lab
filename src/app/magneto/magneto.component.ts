import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { RxBus } from '../rxbus';
import { Theme } from '../theme.core';
import { ApiService } from './api.service';
import { Magneto } from './magneto';

@Component({
  selector: 'app-magneto',
  templateUrl: './magneto.component.html',
  styleUrls: ['./magneto.component.less']
})
@Theme('currentTheme')
export class MagnetoComponent implements OnInit, OnDestroy {
  loading = false;
  transform = `scaleX(${document.body.clientWidth / 60})`;

  keyword = new FormControl('');
  magneto: Magneto;

  subscription: Subscription = new Subscription();
  apiSubscription: Subscription;
  magnetoEventObservable: Observable<any>;

  constructor(private api: ApiService, private sanitizer: DomSanitizer, private rxbus: RxBus) {
    const onresize = window.onresize;
    window.onresize = ev => {
      if (onresize instanceof Function) {
        onresize.call(onresize, ev);
      }
      this.transform = `scaleX(${document.body.clientWidth / 60})`;
    };

    this.subscription.add((this.keyword.valueChanges as Observable<string>)
      .pipe(
        debounceTime(500),
        map(keyword => keyword.trim()),
        filter(keyword => keyword !== ''),
      )
      .subscribe(keyword => {
        if (this.apiSubscription != null && !this.apiSubscription.closed) {
          this.apiSubscription.unsubscribe();
        }
        this.loading = true;
        this.apiSubscription = this.api.magneto(keyword)
          .subscribe(magneto => this.magneto = magneto, () => this.loading = false, () => this.loading = false);
      }));

    this.magnetoEventObservable = rxbus.register<any>('magneto');
    this.subscription.add(this.magnetoEventObservable.subscribe(event => {
      this.keyword.patchValue(event.keyword);
    }));
  }

  load(index?: number) {
    const keyword = this.keyword.value.trim();
    if (keyword === '') {
      this.magneto = null;
      return;
    }

    if (this.apiSubscription != null && !this.apiSubscription.closed) {
      this.apiSubscription.unsubscribe();
    }
    this.loading = true;
    this.apiSubscription = this.api.magneto(keyword, index)
      .subscribe(magneto => this.magneto = magneto, () => this.loading = false, () => this.loading = false);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription != null && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.magnetoEventObservable != null) {
      this.rxbus.unregister('magneto', this.magnetoEventObservable);
    }
  }

}
