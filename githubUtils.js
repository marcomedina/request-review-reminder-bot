var GitHubApi = require("github");
var Promise = require("bluebird");

var github = new GitHubApi();
var results = {};

github.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN,
});

function getOpenPullRequests(owner, repo) {
    return github.pullRequests.getAll({owner: owner, repo: repo, state: 'open'});
}

function getReviewRequests(openPullRequests) {
    var p = [];
    results.pullRequests = openPullRequests;
    openPullRequests.forEach(function(pullRequest) {
        var repo = pullRequest.base.repo.name;
        var owner = pullRequest.base.repo.owner.login;
        p.push(github.pullRequests.getReviewRequests({owner: owner, repo: repo, number: pullRequest.number }));
    });
    return Promise.all(p);
}

function createReturnObject(reviewsByPullRequest) {
    var reviewsByUser = {};
    reviewsByPullRequest.forEach(function(reviews, index) {
        var pullRequest = results.pullRequests[index];
        reviews.forEach(function(review) {
            if(!reviewsByUser[review.login]) {
                reviewsByUser[review.login] = [];
            }

            var info = {
                title: pullRequest.title,
                url: pullRequest.html_url
            };

            reviewsByUser[review.login].push(info);
        });
    });

    return reviewsByUser;
}

module.exports = {
    getPendingRequestedReviews: function(owner, repo) {
        return getOpenPullRequests(owner, repo).then(getReviewRequests).then(createReturnObject);
    }
};
