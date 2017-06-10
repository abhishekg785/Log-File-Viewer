var express = require('express');
var router = express.Router();

var indexController = require('../controllers/indexController');


router.get('/', indexController.GetIndex);
router.post('/', indexController.ProcessLogFile);


module.exports = router;
