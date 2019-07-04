// Message Shifting Plugin
// Moves X messages from one channel
// to a different channel.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')

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
  },

  prefix: function(msg, opts) {
    let useage = Util.parse(lang.prefix.use)
    if (!opts) return msg.channel.send(useage)

    DB.set(msg.guild.id, 'prefix', opts.join(' '))
    let setPrefix = Util.parse(lang.prefix.set, opts.join(' '))
    return msg.channel.send(setPrefix)
  },

  staff: async function(msg, opts) {
    if (!opts || !opts.length) {
      let response = Util.parse(lang.staff.none)
      let staff = await DB.get(msg.guild.id, 'modID')
      if (staff) response = Util.parse(lang.staff.curr, staff)
      return msg.channel.send(response)
    }

    else if (opts.length == 1) {
      let role = Util.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        let noChannel = Util.parse(lang.staff.lost, opts[0])
        return msg.channel.send(noChannel)
      }
      DB.set(msg.guild.id, 'modID', role)
      let setStaff = Util.parse(lang.staff.curr, role)
      return msg.channel.send(setStaff)
    }

    else {
      let useage = Util.parse(lang.staff.use)
      return msg.channel.send(useage)
    }
  }

}