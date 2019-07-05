// Basic Plugin
// For the real simple.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').basics

module.exports = {

  free: ['help', 'invite'],

  help: function(msg, opts) {
    let name = Util.parse(lang.help.name)
    let desc = Util.parse(lang.help.desc)
    return msg.channel.send(Util.box(desc, name))
  },

  invite: function(msg, opts) {
    let name = Util.parse(lang.invite.name)
    let desc = Util.parse(lang.invite.desc)
    return msg.channel.send(Util.box(desc, name))
  }

}