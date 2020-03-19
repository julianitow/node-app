var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query.ville);
  res.render('ville', { ville: req.query.ville });
});

module.exports = router;