const noop = () => { };
const global = window as any;

export class Recorder {
    audioContext: any;
    stream: MediaStream;
    media: any;

    options: any;
    state = 0;

    buffer: Array<Int16Array> = [];
    dataSize = 0;
    process: any;

    constructor(options: any) {
        this.options = Object.assign({
            type: 'wav',
            bitRate: 16,
            sampleRate: 16000,
            bufferSize: 8192,
            onProcess: noop
        }, options);
    }

    isOpen(): boolean {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            if (tracks.length > 0) {
                return tracks[0].readyState === 'live';
            }
        }
        return false;
    }

    open(success?: () => void, error?: (errMsg: string) => void) {
        success = success || noop;
        error = error || noop;

        if (this.isOpen()) {
            success();
            return;
        }

        const notSupport = ':( not support.';
        let AudioContext = global.AudioContext;
        if (!AudioContext) {
            AudioContext = global.webkitAudioContext;
        }
        if (!AudioContext) {
            error(notSupport);
            return;
        }
        let env: any = navigator.mediaDevices || {};
        if (!env.getUserMedia) {
            env = navigator;
            if (!env.getUserMedia) {
                env.getUserMedia = env.webkitGetUserMedia || env.mozGetUserMedia || env.msGetUserMedia;
            }
        }
        if (!env.getUserMedia) {
            error(notSupport);
            return;
        }

        this.audioContext = this.audioContext || new AudioContext();
        const successCallback = (stream: MediaStream) => {
            this.stream = stream;
            success();
        };
        const errorCallback = (err: any) => {
            let errMsg = err.name || err.code || '';
            errMsg = /Permission/i.test(errMsg) ? 'permission denied' : `get user media error: ${errMsg}`;
            error(errMsg);
        };
        const promise = env.getUserMedia({ audio: true }, successCallback, errorCallback);
        if (promise && promise.then) {
            promise.then(successCallback).catch(errorCallback);
        }
    }

    close(callback?: () => void) {
        callback = callback || noop;

        this.stop();
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        this.stream = null;

        callback();
    }

    record() {
        this.state = 0;
        this.buffer = [];
        this.dataSize = 0;
        if (!this.isOpen()) {
            return;
        }

        this.media = this.audioContext.createMediaStreamSource(this.stream);
        this.process = (this.audioContext.createScriptProcessor || this.audioContext.createJavaScriptNode)
            .call(this.audioContext, this.options.bufferSize, 1, 1);

        let onProcess: any;
        this.process.onaudioprocess = event => {
            if (this.state !== 1) {
                return;
            }
            const inputData = event.inputBuffer.getChannelData(0);
            const size = inputData.length;
            this.dataSize += size;

            const data = new Int16Array(size);
            let power = 0;
            // floatTo16BitPCM
            for (let i = 0; i < size; i++) {
                let s = Math.max(-1, Math.min(1, inputData[i]));
                s = s < 0 ? s * 0x8000 : s * 0x7FFF;
                data[i] = s;
                power += Math.abs(s);
            }
            this.buffer.push(data);
            power /= size;

            let powerLevel = 0;
            if (power > 0) {
                // https://blog.csdn.net/jody1989/article/details/73480259
                powerLevel = Math.round(Math.max(0, (20 * Math.log10(power / 0x7fff) + 34) * 100 / 34));
            }
            const duration = Math.round(this.dataSize / this.audioContext.sampleRate * 1000);

            clearTimeout(onProcess);
            onProcess = setTimeout(() => {
                this.options.onProcess(this.buffer, powerLevel, duration);
            });
        };

        this.media.connect(this.process);
        this.process.connect(this.audioContext.destination);
        this.state = 1;
    }

    save(success?: (blob: Blob, duration: number) => void, error?: (errMsg: string) => void) {
        success = success || noop;
        error = error || noop;
        if (!this.state) {
            error('not recording.');
            return;
        }
        this.stop();
        if (!this.dataSize) {
            error('no data.');
            return;
        }

        const res = new Int16Array(this.dataSize);
        let offset = 0;
        for (const data of this.buffer) {
            res.set(data, offset);
            offset += data.length;
        }
        const duration = Math.round(this.dataSize / this.audioContext.sampleRate * 1000);
        setTimeout(() => {
            this[this.options.type](res, blob => {
                success(blob, duration);
            });
        });
    }

    stop() {
        if (this.state) {
            this.state = 0;
            this.media.disconnect();
            this.process.disconnect();
        }
    }

    pause() {
        if (this.state) {
            this.state = 2;
        }
    }

    resume() {
        if (this.state) {
            this.state = 1;
        }
    }

    wav(res: Int16Array, callback: (blob: Blob) => void) {
        // https://www.cnblogs.com/blqw/p/3782420.html
        const rate = Math.round(this.audioContext.sampleRate / this.options.sampleRate);
        if (rate > 1) {
            this.dataSize = Math.floor(this.dataSize / rate);
            const compression = new Int16Array(this.dataSize);
            let i = 0;
            let j = 0;
            while (i < this.dataSize) {
                compression[i] = res[j];
                j += rate;
                i++;
            }
            res = compression;
        } else {
            this.options.sampleRate = this.audioContext.sampleRate;
        }

        // https://github.com/mattdiamond/Recorderjs https://www.cnblogs.com/blqw/p/3782420.html
        // https://www.cnblogs.com/xiaoqi/p/6993912.html
        const dataLength = this.dataSize * (this.options.bitRate / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const data = new DataView(buffer);

        let offset = 0;
        const writeString = str => {
            for (let i = 0; i < str.length; i++ , offset++) {
                data.setUint8(offset, str.charCodeAt(i));
            }
        };
        const write16 = val => {
            data.setUint16(offset, val, true);
            offset += 2;
        };
        const write32 = val => {
            data.setUint32(offset, val, true);
            offset += 4;
        };

        /* RIFF identifier */
        writeString('RIFF');
        /* RIFF chunk length */
        write32(36 + dataLength);
        /* RIFF type */
        writeString('WAVE');
        /* format chunk identifier */
        writeString('fmt ');
        /* format chunk length */
        write32(16);
        /* sample format (raw) */
        write16(1);
        /* channel count */
        write16(1);
        /* sample rate */
        write32(this.options.sampleRate);
        /* byte rate (sample rate * block align) */
        write32(this.options.sampleRate * (this.options.bitRate / 8));
        /* block align (channel count * bytes per sample) */
        write16(this.options.bitRate / 8);
        /* bits per sample */
        write16(this.options.bitRate);
        /* data chunk identifier */
        writeString('data');
        /* data chunk length */
        write32(dataLength);
        // 写入采样数据
        if (this.options.bitRate === 8) {
            for (let i = 0; i < this.dataSize; i++ , offset++) {
                let val = res[i];
                val = Math.trunc((255 / (65535 / (val + 32768))));
                data.setInt8(offset, val);
            }
        } else {
            for (let i = 0; i < this.dataSize; i++ , offset += 2) {
                data.setInt16(offset, res[i], true);
            }
        }

        callback(new Blob([data], { type: 'audio/wav' }));
    }
}
