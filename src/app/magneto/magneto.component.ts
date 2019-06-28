import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { Theme } from '../theme.core';

import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, filter, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Magneto } from './magneto';

@Component({
  selector: 'app-magneto',
  templateUrl: './magneto.component.html',
  styleUrls: ['./magneto.component.less']
})
@Theme('currentTheme')
export class MagnetoComponent implements OnInit {
  loading = false;
  transform = `scaleX(${document.body.clientWidth / 60})`;

  keyword = new FormControl('');
  subscription: Subscription;
  magneto: Magneto;

  constructor(private api: ApiService, private sanitizer: DomSanitizer) {
    const onresize = window.onresize;
    window.onresize = ev => {
      if (onresize instanceof Function) {
        onresize.call(onresize, ev);
      }
      this.transform = `scaleX(${document.body.clientWidth / 60})`;
    };

    (this.keyword.valueChanges as Observable<string>)
      .pipe(
        debounceTime(500),
        map(keyword => keyword.trim()),
        filter(keyword => keyword !== ''),
      )
      .subscribe(keyword => {
        if (this.subscription != null && !this.subscription.closed) {
          this.subscription.unsubscribe();
        }
        this.loading = true;
        this.subscription = this.api.magneto(keyword)
          .subscribe(magneto => this.magneto = magneto, () => this.loading = false, () => this.loading = false);
      });
  }

  load(index?: number) {
    const keyword = this.keyword.value.trim();
    if (keyword === '') {
      this.magneto = null;
      return;
    }

    if (this.subscription != null && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.loading = true;
    this.subscription = this.api.magneto(keyword, index)
      .subscribe(magneto => this.magneto = magneto, () => this.loading = false, () => this.loading = false);
  }

  ngOnInit() {
  }

}
