const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.post("/jira-webhook", (req, res) => {
  console.log("Received POST request at /jira-webhook");
  res.send("Webhook received");
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
