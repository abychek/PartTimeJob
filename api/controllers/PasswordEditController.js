var bcrypt = require('bcryptjs');

/**
 * Hash a passport password.
 *
 * @param {Object}   password
 * @param {Function} next
 */
function hashPassword(passport, next) {
  if (passport.password) {
    bcrypt.hash(passport.password, 10, function (err, hash) {
      passport.password = hash;
      next(err, passport);
    });
  } else {
    next(null, passport);
  }
}

module.exports = {
  main: function (req, res) {
    return res.view('password/index');
  },

  update: function (req, res) {
    if (req.param("Password") == req.param("confirmPassword")) {
      Passport.update({user: req.session.passport.user}, {password: req.param("Password")}).exec(function (err, success) {
          if (err) return res.send(500);
          return res.redirect('/');
        }
      )
    }
  }
};

