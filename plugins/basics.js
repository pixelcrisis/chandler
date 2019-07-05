// Basic Plugin
// For the real simple.

const Utils = require('../utils/utils.js')
const Embed = require('../utils/embed.js')
const lang = require('../data/lang.json').basics

module.exports = {

  free: ['help', 'invite'],

  help: function(msg, opts) {
    let name = Utils.parse(lang.help.name)
    let desc = Utils.parse(lang.help.desc)
    return msg.channel.send($.embed.make(desc, name))
  },

  invite: function(msg, opts) {
    let name = Utils.parse(lang.invite.name)
    let desc = Utils.parse(lang.invite.desc)
    return msg.channel.send(Embed.make(desc, name))
  }

}