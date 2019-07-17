import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import {
    BrowserWindow
} from 'electron';

export class AIUI {
    initialize() {
        const koa = new Koa();
        koa.use(bodyParser());
        const router = new Router();
        router.get('/magneto', async ctx => {
            const query = ctx.query;
            const keyword = query.keyword;
            BrowserWindow.getAllWindows()[0].webContents.send('aiui', {
                tag: 'magneto',
                payload: {
                    keyword
                }
            });
        });
        koa.use(router.middleware());
        this.server = koa.listen(8000);
    }

    destroy() {
        this.server.close();
    }
}