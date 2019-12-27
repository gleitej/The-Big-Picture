const methodOverride = require('method-override'),
  express = require('express'),
  bodyparser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  User = require('./models/user'),
  config = require('config'),
  db = config.get('mongoURI'),
  app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

// === Passport config
app.use(
  require('express-session')({
    secret: 'shooting for the moon',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ===

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('database is connected');
  })
  .catch(err => {
    console.log(`data base error ${err.message}`);
    process.exit(-1);
  });

app.get('/', (req, res) => {
  res.redirect('/home');
});

const userRoutes = require('./routes/index.js'),
  adminRoutes = require('./routes/admin.js');
app.use('/home', userRoutes);
app.use('/admin', adminRoutes);

app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
