import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as ClipboardJS from 'clipboard';
import Hammer from 'hammerjs';
import { Magnet } from '../magnet';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit, AfterViewInit {
  @Input()
  magnet: Magnet | any;

  @ViewChild('record')
  element: ElementRef<HTMLDivElement>;

  constructor(private message: NzMessageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const link = this.element.nativeElement.children[0] as HTMLLinkElement;
    const button = this.element.nativeElement.children[2] as HTMLButtonElement;
    const clipboard = new ClipboardJS(button);
    clipboard.on('success', () => this.message.success('Copied!'));
    const hammer = new Hammer(link, {
      recognizers: [
        [Hammer.Press, { time: 2000 }],
      ]
    });
    hammer.on('press', () => button.click());
  }

}
