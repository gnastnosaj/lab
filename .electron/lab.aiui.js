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
                hostname: 'aiui.jasontsang.dev',
                port: 443,
                path: `/magneto?keyword=${encodeURIComponent(intent.slots.something.value)}`,
                method: 'GET',
                rejectUnauthorized: false
            };
            const req = https.request(options);
            req.end();
            response.setOutputSpeech('正在搜索');
        }
    }
    aiui.commit();
});