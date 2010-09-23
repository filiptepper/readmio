var readmio = require("express").createServer();

readmio.get("/", function(request, response) {
  response.send("Hello world!");
});

readmio.listen(3000);
