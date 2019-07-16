import * as http from 'http';
import * as crypto from 'crypto';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import {
    BrowserWindow
} from 'electron';

export class AIUI {
    constructor() {
        this.APPID = '5d26f756';
        this.API_KEY = '1ecbf0234231cb1ab47b76ce4376fa7e';
        this.AUTH_ID = 'edc8e281d86f619df867537291bfe6f3';
        this.TOKEN = 'c56a134a016ac310';
    }

    initialize() {
        const koa = new Koa();
        koa.use(bodyParser());
        const router = new Router();
        router.get('/magneto', async ctx => {
            const query = ctx.query;
            const keyword = query.keyword;
            BrowserWindow.getAllWindows()[0].webContents.send('ipc', {
                tag: 'magneto',
                payload: {
                    keyword
                }
            });
        });
        koa.use(router.middleware());
        // koa.use(async ctx => {
        //     if (ctx.method === 'GET') {
        //         const query = ctx.query;
        //         const signature = query.signature;
        //         const token = this.TOKEN;
        //         const timestamp = query.timestamp;
        //         const rand = query.rand;
        //         const shasum = crypto.createHash('sha1').update([token, timestamp, rand].sort().join('')).digest('hex');
        //         if (shasum === signature) {
        //             ctx.body = crypto.createHash('sha1').update(token).digest('hex');
        //         } else {
        //             ctx.throw(403);
        //         }
        //     } else if (ctx.method === 'POST') {
        //         console.log(ctx.request.body);
        //     } else {
        //         ctx.throw(404);
        //     }
        // });
        this.server = koa.listen(8000);
    }

    request(data) {
        return new Promise((resolve, reject) => {
            const X_CurTime = Math.floor(Date.now() / 1000);
            const X_Param = new Buffer(`{"scene": "main_box", "auth_id": "${this.AUTH_ID}", "data_type": "text"}`).toString('base64');
            const X_CheckSum = crypto.createHash('md5').update(this.API_KEY + X_CurTime + X_Param).digest('hex');

            const options = {
                hostname: 'openapi.xfyun.cn',
                path: '/v2/aiui',
                method: 'POST',
                headers: {
                    'X-Param': X_Param,
                    'X-CurTime': X_CurTime,
                    'X-CheckSum': X_CheckSum,
                    'X-Appid': this.APPID
                }
            };

            const req = http.request(options, res => {
                res.setEncoding('utf-8');
                res.on('data', chunk => resolve(chunk));
            });

            req.on('error', err => reject(err));

            req.write(data);
            req.end();
        });
    }

    destroy() {
        this.server.close();
    }
}