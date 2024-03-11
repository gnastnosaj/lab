import { Injectable, NgZone } from '@angular/core';
import { RxBus } from '../rxbus';
import { HttpClient } from '@angular/common/http';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BlocklyComponent } from './blockly.component';

@Injectable({
    providedIn: 'root'
})
export class Blockly {
    private overlayRef: OverlayRef;

    constructor(private rxbus: RxBus, private ngZone: NgZone, private http: HttpClient, private overlay: Overlay) {

    }

    attach() {
        if (this.overlayRef == null) {
            this.overlayRef = this.overlay.create({
                width: '80vw',
                height: '60vh'
            });
            const globalPositionStrategy = this.overlay.position().global();
            globalPositionStrategy.top('20vh');
            globalPositionStrategy.left('10vw');
            this.overlayRef.updatePositionStrategy(globalPositionStrategy);
            const componentPortal = new ComponentPortal(BlocklyComponent);
            const componentRef = this.overlayRef.attach(componentPortal);
            (componentRef.instance as BlocklyComponent).proxy = this;
        }
    }

    dettach() {
        if (this.overlayRef != null) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
