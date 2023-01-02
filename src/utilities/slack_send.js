const { WebClient } = require('@slack/web-api');
const fs = require('fs');
const core = require('@actions/core');

export const slackSend = async () => {
    // Defining all the need core input from the git action
    const token = core.getInput('slack_token');
    const path = core.getInput('path');
    const channel_id = core.getInput('channel_id');
    const filename = core.getInput('filename');
    const filetype = core.getInput('filetype');
    const comment = core.getInput('comment');

    //  Calling slack client 
    const web = new WebClient(token);

    // Processing action
    try {
        const result = await web.filesUploadV2({
            channel_id: channel_id,
            title: comment,
            filename: `${filename}`,
            file: fs.createReadStream(path),
        });
        if (result.ok == false) {
            core.setFailed(result.error ?? "Unknown error")
            return;
        }
        core.setOutput("response", JSON.stringify(result));
    } catch (error) {
        core.setFailed(error.message)
    }
}
