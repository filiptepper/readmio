var express          = require("express");
var fs               = require("fs");
var jade             = require("jade");
var OAuth            = require("oauth").OAuth;
var yaml             = require("yaml");

var config = {};

var application = {};
application.run_server = function() {
  var readmio = express.createServer();

  readmio.get("/", function(request, response) {
    response.render("./desktop/index.jade");
  });

  readmio.set("view engine", "jade");
  readmio.set("view options", { layout: false });

  readmio.listen(config["application"]["port"]);

  var authentication = new OAuth("http://twitter.com/oauth/request_token",
    "http://twitter.com/oauth/access_token",
    config["twitter"]["key"],
    config["twitter"]["secret"],
    "1.0",
    config["twitter"]["callback_url"],
    "HMAC-SHA1");
}

fs.readFile("./config/config.yml", "UTF-8", function(error, data) {
  if (error) throw error;
  config = yaml.eval(data);
  application.run_server();
});
