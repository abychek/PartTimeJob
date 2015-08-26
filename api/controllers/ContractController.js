/**
 * ContractController
 *
 * @description :: Server-side logic for managing contracts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  main: function (req, res) {
    Contract.find({owner: req.session.passport.user}).exec(function (err, contracts) {
      if (err)return res.send(500);
      return res.view('contract/index', {
        contracts: contracts
      });
    })
  },

  createForm: function (req, res) {
    return res.view('contract/create')
  },

  create: function (req, res) {
    User.findOne({id: req.session.passport.user}).exec(function (err, user) {
      if (err) return res.json("find error");
      var params = {
        title: req.param('title', 'test'),
        description: req.param('description', 'test'),
        owner: user.id,
        place: user.address
      };
      Contract.create(params).exec(function (err, contract) {
        if (err)return res.send(500);
        return res.redirect('/contracts');
      });
    });
  },

  get: function (req, res) {
    Contract.findOne({id: req.param('id')}).exec(function (err, contract) {
      if (err) return res.send(500);
      Task.find({contract: contract.id, status: {'!': 'denied'}}).exec(function (err, tasks) {
        if (err) return res.send(500);
        var candidates = [];
        for (var i = 0; i < tasks.length; i++) {
          candidates.push(tasks[i].candidate);
        }
        //return res.json(candidates);
        User.find({id: candidates}).exec(function (err, users) {
          if (err)return res.send(500);
          //return res.json(users);
          return res.view('contract/get', {
            contract: contract,
            candidates: users
          });
        });
      });
    });
  },

  approve: function (req, res) {
    User.findOne({id: req.param("candidateId")}).exec(function (err, user) {
      if (err) return res.send(500);
      Contract.findOne({id: req.param("contractId")}).exec(function (err, contract) {
        if (err) return res.send(500);
        Task.findOne({
          contract: contract.id,
          candidate: user.id
        }).exec(function (err, task) {
          if (err) return res.send(500);
          if (task.status == 'approved') {
            return res.redirect('/contracts');
          } else {
            Task.update({
              id: task.id
            }, {status: 'approved'}).exec(function (err, task) {
              if (err) return res.send(500);
              var notify = {
                title: "Your candidature was approved in contract: " + contract.title,
                target: user.id
              };
              Notification.create(notify).exec(function (err, notification) {
                if (err) return res.send(500);
              });
            });
            Task.update({
              contract: contract.id,
              candidate: {'!': user.id}
            }, {status: 'denied'}).exec(function (err, result) {
              if (err) return res.send(500);
              result.forEach(function (res) {
                var notify = {
                  title: "Your candidature was denied in contract: " + contract.title,
                  target: res.candidate
                };
                Notification.create(notify).exec(function (err, notification) {
                  if (err) return res.send(500);
                });
              });
            });
            Contract.update({id: contract.id}, {status: 'engaged'}).exec(function (err) {
              if (err) return res.send(500);
            });
            return res.redirect('/contracts')
          }
        });
      });
    });
  },

  complete: function (req, res) {
    var identifier = req.param("id");
    Contract.update({id: identifier}, {status: 'closed'}).exec(function(err){
      if(err) return res.send(500);
      return res.redirect('/contracts');
    });
  }
};
