/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  main: function (req, res) {
    User.findOne({id: req.session.passport.user}).exec(function (err, user) {
      if (err) return res.send(500);
      return res.view('user/update', {
        username: user.username,
        email: user.email,
        phone: user.phone
      });
    });
  },

  update: function (req, res) {
    var params = req.params.all();
    User.update({id: req.session.passport.user}, params).exec(function (err, user) {
      if (err) return res.send(500);
      res.redirect('/');
    });
  }
};

