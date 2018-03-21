const express = require("express");
const router = express.Router();
const request = require('request');

// Example of a GET / endpoint
router.get("/", (req, resp) => {
  resp.send("Hello World!!");
});

// Example of a POST /echo endpoint
router.post('/echo', (req, resp) => {
  const content = req.body ? JSON.stringify(req.body) : 'No content sent';
  resp.send(content);
});


module.exports = router;
