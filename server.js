const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

const app = express();
const initializePassport = require('./passportConfig');

initializePassport(passport);

const { pool } = require('./dbConfig');

const PORT = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.session());
app.use(passport.initialize());

app.use(flash());

app.get('/', (req, res) => {
  res.render("index");
});

app.get('/users/register', (req, res) => {
  res.render("register");
});

app.get('/users/login', (req, res) => {
  res.render("login", {
    messages: {
      success_msg: req.flash('success_msg'),
      error: req.flash('error')
    }
  });
});


app.get('/users/dashboard', (req, res) => {
  res.render("dashboard", { user: req.user.name });
});

app.get('/users/logout', (req, res, next) => {
  req.logOut(err => {
    if (err) {
      return next(err);
    }
    req.flash('success_msg', 'You have logged out');
    res.redirect('/users/login');
  });
});


app.post('/users/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Validation checks
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    return res.render('register', { errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }

        if (results.rows.length > 0) {
          errors.push({ message: "Email already registered" });
          return res.render('register', { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log("User registered:", results.rows[0]);
              req.flash('success_msg', "You are now registered. Please log in.");
              res.redirect('/users/login');
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Registration error:", err);
    res.render('register', { errors: [{ message: "Something went wrong. Please try again." }] });
  }
});

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});