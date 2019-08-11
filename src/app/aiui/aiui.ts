import { NgZone, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, of, EmptyError } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';
import { Recorder } from './recorder';
import { soundManager } from 'soundmanager2';

import { RxBus } from '../rxbus';
import { AiuiComponent } from './aiui.component';

const global = window as any;
const require = global.nodeRequire;
const remote = require('electron').remote;

@Injectable()
export class AIUI {
    private APPID = '5d26f756';
    private AUTH_ID = 'edc8e281d86f619df867537291bfe6f3';
    private overlayRef: OverlayRef;

    constructor(private rxbus: RxBus, private ngZone: NgZone, private http: HttpClient, private overlay: Overlay) {
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('aiui', (_, args) => {
            this.ngZone.run(() => this.rxbus.post(args.tag, args.payload));
        });
    }

    attach() {
        if (this.overlayRef == null) {
            this.overlayRef = this.overlay.create({
                width: 120,
                height: 120
            });
            const globalPositionStrategy = this.overlay.position().global();
            globalPositionStrategy.right('0px');
            globalPositionStrategy.bottom('0px');
            this.overlayRef.updatePositionStrategy(globalPositionStrategy);
            const componentPortal = new ComponentPortal(AiuiComponent);
            const componentRef = this.overlayRef.attach(componentPortal);
            (componentRef.instance as AiuiComponent).aiui = this;
        }
    }

    dettach() {
        if (this.overlayRef != null) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    record(handler: (arrayBuffer: ArrayBuffer) => void, text?: string): Observable<any> {
        return text ? this.tts(text).pipe(tap(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                handler(reader.result as ArrayBuffer);
            };
            reader.readAsArrayBuffer(blob);
        })) : new Observable(subscriber => {
            const recorder = new Recorder({
                type: 'wav',
                bitRate: 16,
                sampleRate: 16000
            });
            recorder.open(() => {
                recorder.record();
            }, errMsg => subscriber.error(errMsg));
            subscriber.next(recorder);

            return {
                unsubscribe() {
                    recorder.save(blob => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            handler(reader.result as ArrayBuffer);
                        };
                        reader.readAsArrayBuffer(blob);
                        recorder.close();
                    }, errMsg => {
                        console.error(errMsg);
                        recorder.close();
                    });
                }
            };
        });
    }

    play(blob: Blob) {
        soundManager
            .createSound({
                url: URL.createObjectURL(blob),
                onload() {
                    this.play();
                }
            })
            .load();
    }

    iat(data: any, type: string = 'audio'): Observable<string> {
        const api = 'http://openapi.xfyun.cn/v2/aiui';
        const apiKey = '1ecbf0234231cb1ab47b76ce4376fa7e';
        const param = `{
            "scene": "main",
            "auth_id": "${this.AUTH_ID}",
            "data_type": "${type}",
            "pers_param": "{\\\"auth_id\\\":\\\"${this.AUTH_ID}\\\"}"
        }`;
        return this.request(api, apiKey, data, param)
            .pipe(
                flatMap(output => {
                    for (const result of output.data) {
                        if (result.sub === 'nlp' && result.intent && result.intent.answer) {
                            return of(result.intent.answer.text);
                        }
                    }
                    return EmptyError;
                })
            );
    }

    tts(text: string): Observable<Blob> {
        // const api = 'http://api.xfyun.cn/v1/service/v1/tts';
        const api = `https://www.jasontsang.dev/proxy/?url=${encodeURIComponent('http://api.xfyun.cn/v1/service/v1/tts')}`
        const apiKey = '2c1b18e6aade7ed6e2637d7d8b266034';
        const param = `{"auf": "audio/L16;rate=16000", "aue": "raw", "voice_name": "xiaoyan"}`;
        return this.request(api, apiKey, `text=${encodeURIComponent(text)}`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'arraybuffer'
        }).pipe(map(output => new Blob([output], {
            type: 'audio/wav'
        })));
    }

    private request(api: string, apiKey: string, data: any, param: string, options?: any): Observable<any> {
        const crypto = remote.require('crypto');

        const xCurTime = `${Math.floor(Date.now() / 1000)}`;
        const xParam = btoa(param);
        const xCheckSum = crypto.createHash('md5').update(apiKey + xCurTime + xParam).digest('hex') as string;

        const headers = {
            'X-Param': xParam,
            'X-CurTime': xCurTime,
            'X-CheckSum': xCheckSum,
            'X-Appid': this.APPID
        };
        if (options != null) {
            if (options.headers != null) {
                Object.assign(options.headers, headers);
            } else {
                options.headers = headers;
            }
            return this.http.post(api, data, options);
        } else {
            return this.http.post(api, data, {
                headers
            });
        }
    }
}
