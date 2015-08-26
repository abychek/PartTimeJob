/**
* Task.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    candidate: {model: 'User', required: true},
    contract: {model: 'Contract', required: true},
    status: {type: 'string', enum: ['request', 'denied', 'approved'], defaultsTo: 'request'}
  }
};

