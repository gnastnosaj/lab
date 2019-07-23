import { NgZone, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as RecordRTC from 'recordrtc';
import { soundManager } from 'soundmanager2';

import { RxBus } from '../rxbus';
import { AiuiComponent } from './aiui.component';

const global = window as any;
const require = global.nodeRequire;

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
            let recorder: any;

            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    recorder = RecordRTC(stream, {
                        type: 'audio',
                        mimeType: 'audio/wav',
                        recorderType: RecordRTC.StereoAudioRecorder,
                        desiredSampRate: 16000
                    });
                    recorder.startRecording();
                    subscriber.next(recorder);
                })
                .catch(err => subscriber.error(err));

            return {
                unsubscribe() {
                    if (recorder != null && recorder.state !== 'stopped') {
                        recorder.stopRecording(() => {
                            const blob = recorder.getBlob();
                            const reader = new FileReader();
                            reader.onload = () => {
                                handler(reader.result as ArrayBuffer);
                                recorder.destroy();
                            };
                            reader.readAsArrayBuffer(blob);
                        });
                    }
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
        const param = `{"scene": "main_box", "auth_id": "${this.AUTH_ID}", "data_type": "${type}"}`;
        return this.request(api, apiKey, data, param).pipe(map(output => {
            for (const result of output.data) {
                if (result.sub === 'nlp' && result.intent && result.intent.answer) {
                    return result.intent.answer.text;
                }
            }
            return '这个没听清呢，请你说出要搜索内容哦。';
        }));
    }

    tts(text: string): Observable<Blob> {
        const api = 'http://api.xfyun.cn/v1/service/v1/tts';
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
        const crypto = require('electron').remote.require('crypto');

        const xCurTime = `${Math.floor(Date.now() / 1000)}`;
        const xParam = btoa(param);
        const xCheckSum = crypto.createHash('md5').update(apiKey + xCurTime + xParam).digest('hex') as string;

        if (options != null) {
            const headers = {
                'X-Param': xParam,
                'X-CurTime': xCurTime,
                'X-CheckSum': xCheckSum,
                'X-Appid': this.APPID
            };
            if (options.headers != null) {
                Object.assign(options.headers, headers);
            } else {
                options.headers = headers;
            }
            return this.http.post(api, data, options);
        } else {
            return this.http.post(api, data, {
                headers: {
                    'X-Param': xParam,
                    'X-CurTime': xCurTime,
                    'X-CheckSum': xCheckSum,
                    'X-Appid': this.APPID
                }
            });
        }
    }
}
