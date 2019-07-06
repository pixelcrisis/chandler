// Management Plugin
// For Managing Chandler/Servers

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').manage

module.exports = {

  prefix: function(msg, opts) {
    if (!opts || !opts[0] || !opts.join(' ')) {
      return Reply.to(msg, lang.prefix.use)
    }

    State.set(msg.guild.id, 'prefix', opts.join(' '))
    return Reply.to(msg, lang.prefix.set, opts.join(' '))
  },

  staff: function(msg, opts) {
    if (!opts || !opts.length) {
      let staff = State.get(msg.guild.id, 'modID')
      if (staff) return Reply.to(msg, lang.staff.curr, staff)
      else return Reply.to(msg, lang.staff.none)
    }

    else if (opts.length == 1) {
      let role = Reply.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        return Reply.to(msg, lang.staff.lost, opts[0])
      }
      State.set(msg.guild.id, 'modID', role)
      return Reply.to(msg, lang.staff.curr, role)
    }

    else return Reply.to(msg, lang.staff.use)
  },

  clear: function(msg, opts) {
    if (opts.length !== 1) return Reply.to(msg, lang.clear)
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