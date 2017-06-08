var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');


router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', indexController.processLogFile);


module.exports = router;
