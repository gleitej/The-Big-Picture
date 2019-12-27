const express = require('express'),
  router = express.Router(),
  Country = require('../models/country');

router.get('/', (req, res) => {
  Country.find({}, (err, countrySection) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render('landingPage', { countrySection: countrySection });
    }
  });
});

router.get('/photos/:id', (req, res) => {
  Country.findById(req.params.id, (err, country) => {
    if (err) {
      res.redirect('/');
      console.log(err.message);
    } else {
      res.render('photos', { country: country });
    }
  });
});

module.exports = router;
