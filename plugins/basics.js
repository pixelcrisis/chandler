// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').basics

module.exports = {

  free: ['help', 'invite'],

  help: function(msg, opts) {
    return msg.channel.send({
      embed: {
        title: "Chandler Help",
        description: lang.help
      }
    })
  },

  invite: function(msg, opts) {
    return msg.channel.send({
      embed: {
        title: "Let Me Help!",
        description: lang.invite
      }
    })
  },

  prefix: function(msg, opts) {
    if (!opts) {
      let response = Util.parse(lang.usePrefix)
      return msg.channel.send(response)
    }

    DB.set(msg.guild.id, 'prefix', opts.join(' '))
    let response = Util.parse(lang.setPrefix, opts.join(' '))
    msg.channel.send(response)
  }

}