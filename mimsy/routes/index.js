var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Mimsy MMS' });
});

router.get('/create', function(req, res) {
  res.render('create', { title: 'Mimsy MMS - Create Slideshow' });
});

module.exports = router;
