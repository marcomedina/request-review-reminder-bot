var Bot = require('slackbots');

module.exports = {
    send: function(channelName, message, attachments = []) {
        var bot = new Bot({token: process.env.SLACK_TOKEN});
        bot.postMessageToGroup(channelName, message, {attachments: attachments, as_user: true});
    }
};
