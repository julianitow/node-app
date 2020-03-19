var express = require('express');
var router = express.Router();

/* GET ville page. */
router.get('/', function(req, res, next) {
    res.render('ville', { ville: req.query.ville });
});

/* POST ville page. */
router.post('/', function(req, res, next) {
    res.render('ville', { ville: req.body.nom_ville });
});

module.exports = router;