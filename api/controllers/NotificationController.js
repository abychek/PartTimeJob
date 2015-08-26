/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  main: function (req, res) {
    Notification.find({target: req.session.passport.user, status: false}).exec(function (err, notification) {
      if (err) return res.send(500);
      return res.json(notification);
    });
  },

  hide: function (req, res) {
   //console.log("You hear !");
    Notification.update({id: req.param('id')}, {status: true}).exec(function(err,success){
      if(err)return res.send(500);
      return res.ok();
    });
  }
};

