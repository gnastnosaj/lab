import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { EmptyError, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { soundManager } from 'soundmanager2/script/soundmanager2';
import { Recorder } from './recorder';

import { RxBus } from '../rxbus';
import { CognitiveComponent } from './cognitive.component';

@Injectable({
    providedIn: 'root'
})
export class Cognitive {
    private overlayRef: OverlayRef;
    private cache: { [propName: string]: Blob } = {};

    constructor(private rxbus: RxBus, private ngZone: NgZone, private http: HttpClient, private overlay: Overlay) {
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

    load(url: string) {
        soundManager.createSound({
            url,
            onload() {
                this.play();
            }
        }).load()
    }

    iat(data: any): Observable<string> {
        const formData = new FormData();
        formData.append('file', new File([data], "todo.wav", { type: 'audio/wav', lastModified: Date.now() }));
        return this.http.post(`https://ai.jasontsang.dev:4096/asr`, formData)
            .pipe(
                map((response: any) => {
                    if (response?.text) {
                        const tag = window.location.hash.replace('#/', '');
                        const payload = {
                            keyword: response.text
                        };
                        return JSON.stringify({
                            tag,
                            payload
                        });
                    }
                    throw EmptyError;
                }),
            );
    }

    source(text: string, character: string = '派蒙（多情感测试）'): string {
        return `https://ai.jasontsang.dev:4096/tts?cha_name=${encodeURIComponent(character)}&text=${encodeURIComponent(text)}`;
    }

    tts(text: string, character: string = '派蒙（多情感测试）'): Observable<Blob> {
        if (this.cache[text]) {
            return of(this.cache[text]);
        }
        return this.http.get(this.source(text, character), {
            responseType: 'blob'
        }).pipe(
            map((output: any) => new Blob([output], {
                type: 'audio/wav'
            })),
            tap(blob => this.cache[text] = blob)
        );
    }
}
