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
  },

  staff: async function(msg, opts) {
    if (!opts || !opts.length) {
      let staff = await DB.get(msg.guild.id, 'modID')
      let response = Util.parse(staff ? lang.isStaff : lang.noStaff, staff)
      return msg.channel.send(response)
    }

    else if (opts.length == 1) {
      let role = Util.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        let response = Util.parse(lang.badStaff, opts[0])
        return msg.channel.send(response)
      }
      DB.set(msg.guild.id, 'modID', role)
      let response = Util.parse(lang.isStaff, role)
      msg.channel.send(response)
    }
  }

}