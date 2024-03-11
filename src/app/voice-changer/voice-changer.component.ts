import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxBus } from '../rxbus';
import { Observable, Subscription } from 'rxjs';
import { Cognitive } from '../cognitive/cognitive';
import { saveAs } from 'file-saver';
import isMobile from 'ismobilejs';

@Component({
  selector: 'app-voice-changer',
  templateUrl: './voice-changer.component.html',
  styleUrl: './voice-changer.component.less'
})
export class VoiceChangerComponent implements OnInit, OnDestroy {

  tasks: Array<any> = [];

  observable: Observable<any>;
  subscription: Subscription;

  isMobileBrowser = true;

  constructor(private rxbus: RxBus, private cognitive: Cognitive) {
    this.isMobileBrowser = isMobile(window.navigator).any;
  }

  ngOnInit(): void {
    this.observable = this.rxbus.register('cognitive');
    this.subscription = this.observable.subscribe(data => {
      const reader = new FileReader();
      reader.readAsDataURL(data.audio);
      reader.onloadend = () => {
        data.src = reader.result;
        this.tasks.push(data);
        if (this.tasks.length > 10) {
          this.tasks.shift();
        }
        this.tasks = [...this.tasks];
      };
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.rxbus.unregister('cognitive', this.observable);
  }

  replay(task: any) {
    this.cognitive.play(task.audio);
  }

  save(task: any) {
    saveAs(task.audio, `${task.date}.wav`)
  }
}
