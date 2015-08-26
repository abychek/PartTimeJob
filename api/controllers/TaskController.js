/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  main: function(req,res){
    Task.find({candidate: req.session.passport.user, status: {'!': 'denied'}}).exec(function(err,tasks){
      if(err) return res.send(500);
      var contracts = [];
      for(var i = 0; i < tasks.length; i++){
        contracts.push(tasks[i].contract);
      }
      Contract.find({id: contracts}).exec(function(err, contracts){
        if(err) return res.send(500);
        return res.view('task/index',{
          tasks: tasks,
          contracts: contracts
        });
      });
    });
  },

  createForm: function (req, res) {
    User.findOne({id: req.session.passport.user}).exec(function (err, user) {
      Contract.find({place: user.address, owner: {'!': user.id}, status: 'free'}).exec(function (err, contracts) {
        if (err) return res.send(500);
        var owners = [];
        for(var i = 0; i < contracts.length; i++){
          owners.push(contracts[i].owner);
        }
        User.find({id:owners}).exec(function (err,users) {
          if (err) return res.send(500);
          return res.view('task/new', {
            owners: users,
            contracts: contracts
          })
        });
      });
    });
  },

  create: function (req, res) {
    Contract.findOne({id: req.param('id')}).exec(function (err, contract) {
      User.findOne({id: req.session.passport.user}).exec(function (err, user) {
        if (err)return res.send(500);
        var params = {
          candidate: user.id,
          contract: contract.id
        };
        Task.create(params).exec(function (err, task) {
          if (err)return res.send(500);
          var notify = {
            title: user.username + " wants to do your contract: " + contract.title,
            target: contract.owner
          };
          Notification.create(notify).exec(function (err, notification) {
            if (err) return res.send(500);
            return res.redirect('/tasks');
          })
        })
      })
    });
  }
};

