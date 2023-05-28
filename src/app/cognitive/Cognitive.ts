import { NgZone, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, of, EmptyError } from 'rxjs';
import { map, tap, flatMap } from 'rxjs/operators';
import { Recorder } from './recorder';
import { soundManager } from 'soundmanager2';
import CryptoJS from 'crypto-js';

import { RxBus } from '../rxbus';
import { CognitiveComponent } from './cognitive.component';

const global = window as any;
const require = global.nodeRequire;

@Injectable({
    providedIn: 'root'
})
export class Cognitive {
    private readonly baseUrl = 'https://bypass.jasontsang.dev:4096/';
    private readonly appID = '5d26f756';
    private readonly authID = 'edc8e281d86f619df867537291bfe6f3';
    private overlayRef: OverlayRef;
    private cache: { [propName: string]: Blob } = {};

    constructor(private rxbus: RxBus, private ngZone: NgZone, private http: HttpClient, private overlay: Overlay) {
        if (require) {
            const { ipcRenderer } = require('electron');
            ipcRenderer.on('aiui', (_, args) => {
                this.ngZone.run(() => this.rxbus.post(args.tag, args.payload));
            });
        }
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
            const componentPortal = new ComponentPortal(CognitiveComponent);
            const componentRef = this.overlayRef.attach(componentPortal);
            (componentRef.instance as CognitiveComponent).cognitive = this;
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
                unsubscribe: () => {
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
        const api = `${this.baseUrl}http://openapi.xfyun.cn/v2/aiui`;
        const apiKey = '1ecbf0234231cb1ab47b76ce4376fa7e';
        const param = `{
            "scene": "main",
            "auth_id": "${this.appID}",
            "data_type": "${type}",
            "pers_param": "{\\\"auth_id\\\":\\\"${this.authID}\\\"}"
        }`;
        return this.request(api, apiKey, data, param)
            .pipe(
                flatMap(output => {
                    for (const result of output.data) {
                        if (result.sub === 'nlp' && result.intent && result.intent.answer) {
                            return of(result.intent.answer.text);
                        }
                    }
                    throw EmptyError;
                })
            );
    }

    tts(text: string): Observable<Blob> {
        if (this.cache[text]) {
            return of(this.cache[text]);
        }
        const api = `${this.baseUrl}http://api.xfyun.cn/v1/service/v1/tts`;
        const apiKey = '2c1b18e6aade7ed6e2637d7d8b266034';
        const param = `{"auf": "audio/L16;rate=16000", "aue": "raw", "voice_name": "xiaoyan"}`;
        return this.request(api, apiKey, `text=${encodeURIComponent(text)}`, param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            responseType: 'arraybuffer'
        }).pipe(
            map(output => new Blob([output], {
                type: 'audio/wav'
            })),
            tap(blob => this.cache[text] = blob)
        );
    }

    private request(api: string, apiKey: string, data: any, param: string, options?: any): Observable<any> {
        const xCurTime = `${Math.floor(Date.now() / 1000)}`;
        const xParam = btoa(param);
        const xCheckSum = CryptoJS.MD5(apiKey + xCurTime + xParam).toString();

        const headers = {
            'X-Param': xParam,
            'X-CurTime': xCurTime,
            'X-CheckSum': xCheckSum,
            'X-Appid': this.appID
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
