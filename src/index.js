const core = require('@actions/core');
const FormData = require('form-data');
const telegram = require('./utilities/telegram_bot');
const slack = require('./utilities/slack_bot');
const discord = require('./utilities/discord_bot');
var fs = require('fs');
const zlib = require('zlib');


async function run() {
  try {
    /// Get all the action input values
    const slacktoken = core.getInput('slack_token');
    const path = core.getInput('path');
    const channel = core.getInput('channel');
    const filename = core.getInput('filename');
    const filetype = core.getInput('filetype');
    const comment = core.getInput('comment');
    const telegram_token = core.getInput('telegram_token');
    const telegram_chat_id = core.getInput('telegram_chat_id');
    const zip = core.getInput('zip');
    const webhookUrl = core.getInput('webhook_url');

    // File to pass to each platform
    var file = fs.createReadStream(path);

    /// Allow us to manage zip files
    if (zip) {
      // read the source file
      const source = fs.readFileSync(path);
      // compress the data
      const zipped = zlib.gzipSync(source);
      fs.writeFileSync('./apk.zip', zipped);
      file = fs.createReadStream('./apk.zip');
    }

    /// Send file to telegram incase the token is provided
    if (telegram_token && telegram_chat_id) {
      await telegram.telegramSend(telegram_token, file, telegram_chat_id, comment);
    }

    /// Send file to slack incase the token is provided
    if (slacktoken) {
      var form = new FormData();
      form.append('token', slacktoken);
      form.append('file', file);
      if (filename) form.append('filename', filename);
      if (channel) form.append('channels', channel);
      if (filetype) form.append('filetype', filetype);
      if (comment) form.append('initial_comment', comment);


      await slack.send(form);
    }

    /// Send File to discord 
    if (webhookUrl) {
      await discord.send(file, webhookUrl, comment);
    }

  } catch (error) {
    console.log(error);
    core.setFailed(error);
  }
}

run();