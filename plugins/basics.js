// Basic Plugin
// For the real simple.

const Reply = require('../utils/reply.js')
const lang = require('../data/lang.json').basics

module.exports = {

  free: ['help', 'invite'],

  help: function(msg, opts) {
    return Reply.embed(msg, lang.help.name, lang.help.desc)
  },

  invite: function(msg, opts) {
    return Reply.embed(msg, lang.invite.name, lang.invite.desc)
  }

}