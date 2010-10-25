var express          = require("express");
var fs               = require("fs");
var jade             = require("jade");
var OAuth            = require("oauth").OAuth;
var yaml             = require("yaml");
var url              = require("url");

var config = {};
var application = {};
var authentication = {};

application.run_server = function() {
  var readmio = express.createServer();
  
  readmio.use(express.cookieDecoder());
  readmio.use(express.session());

  readmio.get("/", function(request, response) {
    response.render("./desktop/index.jade");
  });

  readmio.get("/twitter/authenticate", function(request, response) {
    authentication.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
      request.session.oauth_token_secret = oauth_token_secret;
      response.writeHead(303, { "Location": "http://twitter.com/oauth/authorize?oauth_token=" + oauth_token });
      response.end("");
    });
  });
  
  readmio.get("/twitter/callback", function(request, response) {
    var parsed_url = url.parse(request.url, true);

    authentication.getOAuthAccessToken(parsed_url.query.oauth_token, request.session.oauth_token_secret, parsed_url.query.oauth_verifier, 
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        authentication.getProtectedResource("http://api.twitter.com/1/statuses/home_timeline.json", "GET", oauth_access_token, oauth_access_token_secret, function(error, data, twitter_response) {
          console.log(data);
          response.render("./desktop/home.jade");
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
    null,
    "HMAC-SHA1");

  application.run_server();
});
