var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/posts', function(req, res, next) {
  res.json([{ _id: "1", title: 'Express', body:'Sumit'},
  	{ _id: "2" ,title: 'Express', body:'Sumit'},
  	{ _id: "3", title: 'Express', body:'Sumit'}]);
  // res.send("hello");
});

module.exports = router;
