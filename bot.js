if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

var slackMessage = require('./slackMessage.js');
var githubUtils = require('./githubUtils.js');

module.exports = {
    sendMessage: function() {
        githubUtils.getPendingRequestedReviews(process.env.GITHUB_OWNER, process.env.GITHUB_REPO).then(function(reviewsByUser) {
            var att = [];

            for (var key in reviewsByUser) {
                if (!reviewsByUser.hasOwnProperty(key)) continue;

                var user = reviewsByUser[key];
                var a = {
                    title: key,
                    text: "",
                    color: '#'+Math.floor(Math.random()*16777215).toString(16)
                };

                user.forEach(function(pr) {
                    a.text = a.text + "<" + pr.url + "|" +  pr.title + ">" + "\n";
                });

                att.push(a);
            }

            slackMessage.send(process.env.SLACK_CHANNEL, '*Pending Reviews* 🕚:', att);
        });
    }
};

