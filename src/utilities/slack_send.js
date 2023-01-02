import { getInput, setFailed, setOutput } from '@actions/core';
import { WebClient } from '@slack/web-api';
import { createReadStream } from 'fs';


export default async function slackSend() {
    // Defining all the need core input from the git action
    const token = getInput('slack_token');
    const path = getInput('path');
    const channel_id = getInput('channel_id');
    const filename = getInput('filename');
    const filetype = getInput('filetype');
    const comment = getInput('comment');
    
    //  Calling slack client 
    const web = new WebClient(token);

    // Processing action
    try {
        const result = await web.filesUploadV2({
            channel_id: channel_id,
            title: comment,
            filename: `${filename}.${filetype}`,
            file: createReadStream(path),
        });
        if (result.ok == false) {
            setFailed(result.error ?? "Unknown error")
            return;
        }
        setOutput("response", JSON.stringify(result));
    } catch (error) {
        setFailed(error.message)
    }
}
