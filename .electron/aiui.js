AIUI.create('v2', (aiui, /*err*/) => {
    requestObject = aiui.getRequest().getObject();
    const response = aiui.getResponse();
    dialogState = requestObject.request.dialogState;
    if (dialogState != null && dialogState != 'COMPLETED') {
        response.addDelegateDirective();
    } else {
        const intent = requestObject.request.intents.find(intent => intent.name === 'magneto');
        if (intent) {
            response.setOutputSpeech(JSON.stringify({
                tag: 'magneto',
                payload: {
                    keyword: intent.slots.something.value
                }
            }));
        }
    }
    aiui.commit();
});