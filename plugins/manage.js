// Management Plugin
// For Managing Chandler/Servers

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').manage

module.exports = {

  prefix: function(msg, opts) {
    if (!opts || !opts[0] || !opts.join(' ')) {
      return Reply.with(msg, lang.prefix.use)
    }

    State.set(msg.guild.id, 'prefix', opts.join(' '))
    return Reply.with(msg, lang.prefix.set, opts.join(' '))
  },

  staff: function(msg, opts) {
    if (!opts || !opts.length) {
      let staff = State.get(msg.guild.id, 'modID')
      if (staff) return Reply.with(msg, lang.staff.curr, staff)
      else return Reply.with(msg, lang.staff.none)
    }

    else if (opts.length == 1) {
      let role = Reply.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        return Reply.with(msg, lang.staff.lost, opts[0])
      }
      State.set(msg.guild.id, 'modID', role)
      return Reply.with(msg, lang.staff.curr, role)
    }

    else return Reply.with(msg, lang.staff.use)
  },

  clear: function(msg, opts) {
    if (opts.length !== 1) return Reply.with(msg, lang.clear)
    return msg.channel.fetchMessages({ limit: parseInt(opts[0]) + 1 })
      .then(got => { msg.channel.bulkDelete(got) })
  },

  roles: function(msg, opts) {
    let list = [], roles = msg.guild.roles.array()
    for (var i = roles.length - 1; i >= 0; i--) {
      list.push("`" + roles[i].id + "` - " + roles[i].name)
    }
    return Reply.list(msg, "Server Roles", list, '\n')
  }

}