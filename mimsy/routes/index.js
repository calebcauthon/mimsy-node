var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
require('locus');

var redis = require('redis');
var db = redis.createClient();

db.on("error", function (err) {
  console.log("Error " + err);
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Mimsy MMS' });
});

router.get('/create', function(req, res) {
  res.render('create', { phone_number: "", pictures: [], uuid: uuid.v1(), title: 'Mimsy MMS - Create Slideshow' });
});

router.get('/pictures/:uuid', function(req, res) {
  db.hgetall(req.params.uuid, function(err, reply) {
    var phone_number = reply && reply.phone_number;
    db.smembers("pictures_" + req.params.uuid, function(err, reply) {
      res.render('text', { text: reply });
    });
  });
});

router.get('/slideshow/:uuid', function(req, res) {
  db.hgetall(req.params.uuid, function(err, reply) {
    var phone_number = reply && reply.phone_number;
    db.smembers("pictures_" + req.params.uuid, function(err, reply) {
      res.render('create', { phone_number: phone_number, pictures: reply, uuid: req.params.uuid, title: 'Mimsy MMS - Slideshow' });
    });
  });
});

router.post('/slideshow/save', function(req, res) {
  var slideshow_uuid = req.body.slideshow_uuid;
  var phone_number = req.body.phone_number;

  db.hmset(slideshow_uuid, { phone_number: phone_number } , function() {});
  db.set(phone_number, slideshow_uuid, function() {});

  res.render('index', { title: 'Mimsy MMS' });
});

router.post('/receive_mms', function(req, res) {
  var image_url = req.body.images[0].image;
  var phone_number = req.body.msisdn;
  
  db.get(phone_number, function(err, slideshow_uuid) {
    db.sadd("pictures_" + slideshow_uuid, image_url, function() {});  
    res.render('text', { text: '' });
  });
});

router.get('/:digits.jpg', function(req, res) {
  var phone_number = req.params.digits;
  
  db.get("picture-1-" + phone_number, function(err, reply) {
    var image_url = reply;    

    res.render('image', { phone_number: phone_number, image_url: image_url, title: 'Mimsy MMS' });  
  });
});

module.exports = router;
