import {
    BrowserWindow
} from 'electron';

import * as net from 'net';

export const AUTH_ID = 'edc8e281d86f619df867537291bfe6f3';

export class AIUI {
    initialize() {
        const socket = net.connect({
            host: 'www.jasontsang.dev',
            port: 4400
        }, () => {
            socket.setEncoding('utf8');
            socket.write(JSON.stringify({
                tag: 'connection',
                payload: {
                    device: {
                        authId: AUTH_ID
                    }
                }
            }));
        });

        socket.on('data', data => {
            data = JSON.parse(data.toString());
            console.log(JSON.stringify(data));
            BrowserWindow.getAllWindows()[0].webContents.send('aiui', data);
        });

        this.socket = socket;
    }

    destroy() {}
}