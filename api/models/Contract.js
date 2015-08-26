/**
* Contract.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title : {type: 'string', required: true},
    description : {type: 'string'},
    owner: {model: 'User', required: true},
    place: {type: 'string'},
    status: {type: 'string', enum: ['free', 'engaged', 'closed'], defaultsTo: 'free'}
  }
};

