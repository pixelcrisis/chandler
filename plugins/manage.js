// Management Plugin
// For Managing Chandler/Servers

const Utils = require('../utils/utils.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').manage

module.exports = {

  prefix: function(msg, opts) {
    let useage = Utils.parse(lang.prefix.use)
    if (!opts) return msg.channel.send(useage)

    State.set(msg.guild.id, 'prefix', opts.join(' '))
    let setPrefix = Utils.parse(lang.prefix.set, opts.join(' '))
    return msg.channel.send(setPrefix)
  },

  staff: function(msg, opts) {
    if (!opts || !opts.length) {
      let response = Utils.parse(lang.staff.none)
      let staff = State.get(msg.guild.id, 'modID')
      if (staff) response = Utils.parse(lang.staff.curr, staff)
      return msg.channel.send(response)
    }

    else if (opts.length == 1) {
      let role = Utils.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        let noChannel = Utils.parse(lang.staff.lost, opts[0])
        return msg.channel.send(noChannel)
      }
      State.set(msg.guild.id, 'modID', role)
      let setStaff = Utils.parse(lang.staff.curr, role)
      return msg.channel.send(setStaff)
    }

    else {
      let useage = Utils.parse(lang.staff.use)
      return msg.channel.send(useage)
    }
  },

  clear: function(msg, opts) {
    let useage = Utils.parse(lang.clear)
    if (opts.length !== 1) return msg.channel.send(useage)
    return msg.channel.fetchMessages({ limit: parseInt(opts[0]) + 1 })
      .then(got => { msg.channel.bulkDelete(got) })
  },

  roles: function(msg, opts) {
    let response = '', roles = msg.guild.roles.array()
    for (var i = roles.length - 1; i >= 0; i--) {
      if (roles[i].name != "@everyone") {
        response += "`" + roles[i].name + " - " + roles[i].id + "`\n"
      }
    }
    return msg.channel.send(response)
  }

}