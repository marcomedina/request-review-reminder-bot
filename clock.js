var CronJob = require('cron').CronJob;
var bot = require('./bot.js');

new CronJob({
    cronTime: '* * * * *', // this is a job that runs on weekdays at 11am
    onTick: bot.sendMessage(),
    start: true,
    timeZone: 'America/Los_Angeles'
});
