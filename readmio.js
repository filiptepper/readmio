var express = require("express");
var fs = require("fs");
var yaml = require("yaml");

var config = {};

var application = {};
application.run_server = function() {
  var readmio = express.createServer();

  readmio.get("/", function(request, response) {
    response.send("Hello world!");
  });

  readmio.listen(config["application"]["port"]);
}

fs.readFile("./config/config.yml", "UTF-8", function(error, data) {
  if (error) throw error;
  config = yaml.eval(data);
  application.run_server();
});
