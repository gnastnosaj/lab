const https = require('https');

AIUI.create('v2', (aiui, /*err*/ ) => {
    requestObject = aiui.getRequest().getObject();
    const response = aiui.getResponse();
    dialogState = requestObject.request.dialogState;
    if (dialogState != null && dialogState != 'COMPLETED') {
        response.addDelegateDirective();
    } else {
        const intent = requestObject.request.intents.find(intent => intent.name === 'magneto');
        if (intent) {
            const options = {
                hostname: 'www.jasontsang.dev',
                port: 443,
                path: `/aiui/`,
                method: 'POST',
                rejectUnauthorized: false
            };
            const req = https.request(options);
            const data = {
                tag: 'magneto',
                payload: {
                    device: {
                        authId: 'edc8e281d86f619df867537291bfe6f3'
                    },
                    keyword: intent.slots.something.value
                }
            };
            req.write(JSON.stringify(data));
            req.end();
            response.setOutputSpeech('正在搜索');
        }
    }
    aiui.commit();
});