var express          = require("express");
var fs               = require("fs");
var jade             = require("jade");
var OAuth            = require("oauth").OAuth;
var yaml             = require("yaml");

var config = {};
var application = {};
var authentication = {};

application.run_server = function() {
  var readmio = express.createServer();

  readmio.get("/", function(request, response) {
    response.render("./desktop/index.jade");
  });

  readmio.get("/oauth/authenticate", function() {
    authentication.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
      console.log(results);
      authentication.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
        console.log(results2);
        authentication.getProtectedResource("http://api.twitter.com/1/statuses/home_timeline.json", "GET", oauth_access_token, oauth_access_token_secret, function(error, data, response) {
          console.log(data);
        });
      });
    });
  });

  readmio.set("view engine", "jade");
  readmio.set("view options", { layout: false });

  readmio.listen(config["application"]["port"]);
}

fs.readFile("./config/config.yml", "UTF-8", function(error, data) {
  if (error) throw error;
  config = yaml.eval(data);

  authentication = new OAuth("http://twitter.com/oauth/request_token",
    "http://twitter.com/oauth/access_token",
    config["twitter"]["key"],
    config["twitter"]["secret"],
    "1.0",
    config["twitter"]["callback_url"],
    "HMAC-SHA1");

  application.run_server();
});
