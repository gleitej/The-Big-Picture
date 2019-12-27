const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  Country = require('../models/country'),
  User = require('../models/user'),
  upload = require('../services/file-upload');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
}

router.post('/', isLoggedIn, upload.single('file'), async (req, res) => {
  const {
    country,
    text,
    countryId,
    bodyText,
    travelAdvice,
    visaInfo,
    dateVisited
  } = req.body;

  const // photo from middleware
    countryPhoto = await req.file.location,
    // creates id
    id = country.replace(/\s/g, '') + Math.floor(Math.random() * 10000000);

  Country.create(
    {
      country: country,
      text,
      countryId,
      bodyText,
      travelAdvice,
      visaInfo,
      dateVisited,
      countryPhoto,
      id
    },
    err => {
      if (err) {
        console.log(err.message);
      } else {
        res.redirect('/admin');
      }
    }
  );
});

router.get('/', isLoggedIn, (req, res) => {
  Country.find({}, (err, countrySection) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render('postPage', { countrySection: countrySection });
    }
  });
});

router.get('/edit/:id', isLoggedIn, (req, res) => {
  Country.findById(req.params.id, (err, foundCountry) => {
    if (err) {
      res.redirect('/admin');
      console.log(err.message);
    } else {
      res.render('edit', { foundCountry: foundCountry });
    }
  });
});

router.put('/edit/:id', isLoggedIn, upload.single('file'), (req, res) => {
  if (req.file !== undefined) {
    req.body.foundCountry.countryPhoto = req.file.location;
  }
  Country.findByIdAndUpdate(
    req.params.id,
    req.body.foundCountry,
    (err, updatedountry) => {
      if (err) {
        res.redirect(err);
        console.log(err.message);
      } else {
        res.redirect(`/admin/edit/${req.params.id}`);
      }
    }
  );
});

router.delete('/delete/:id', isLoggedIn, (req, res) => {
  Country.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.redirect('/admin');
      console.log(err.messaege);
    } else {
      res.redirect('/admin');
    }
  });
});

// ============
// auth routes
// ============

// router.get('/register', (req, res) => {
//     res.render('register');
// });

// router.post('/register', (req, res) => {
//     req.body.username
//     req.body.password
//     User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{
//         if(err){
//             console.log(err);
//             return res.render('register')
//         } else {
//             passport.authenticate('local')(req, res, () => {
//                 res.redirect('/admin');
//             });
//         }
//     });
// });

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login'
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/admin/login');
});

module.exports = router;
