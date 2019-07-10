// Bot Manager Plugin
// For the Basic, Chandler Specific.

const Reply = require('../utility/reply.js')
const State = require('../utility/state.js')
const lang = require('../data/lang.json').manager

module.exports = {

  free: ['help', 'invite'],

  help(msg, opts) {
    return Reply.with(msg, lang.help)
  },

  invite(msg, opts) {
    return Reply.with(msg, lang.invite)
  },

  prefix(msg, opts) {
    if (!opts || !opts[0] || !opts.join(' ')) {
      return Reply.with(msg, lang.prefix.use)
    }

    State.setConfig(msg.guild.id, 'prefix', opts.join(' '))
    return Reply.with(msg, lang.prefix.set, opts.join(' '))
  },

  staff(msg, opts) {
    if (!opts || !opts.length) {
      let staff = State.getConfig(msg.guild.id, 'modID')
      if (staff) return Reply.with(msg, lang.staff.curr, staff)
      else return Reply.with(msg, lang.staff.none)
    }

    else if (opts.length == 1) {
      let role = Reply.strip(opts[0])
      if (!msg.guild.roles.has(role)) {
        return Reply.with(msg, lang.staff.lost, opts[0])
      }
      State.setConfig(msg.guild.id, 'modID', role)
      return Reply.with(msg, lang.staff.curr, role)
    }

    else return Reply.with(msg, lang.staff.use)
  },

  roles(msg, opts) {
    let list = [], roles = msg.guild.roles.array()
    for (var i = roles.length - 1; i >= 0; i--) {
      list.push("`" + roles[i].id + "` - " + roles[i].name)
    }
    return Reply.list(msg, "Server Roles", list, '\n')
  },

  onjoin(msg, opts) {
    if (opts.length < 1) return Reply.with(msg, lang.logs.use)
    let channel = Reply.strip(opts.shift())
    let message = opts.join(' ')
    message = message ? message : "{user} joined."
    if (['off', 'false', 'disable'].includes(channel)) channel = false
    State.setConfig(msg.guild.id, 'onjoin', { channel, message })
    if (!channel) return Reply.with(msg, lang.logs.off, 'onjoin')
    else return Reply.with(msg, lang.logs.join, message, channel)
  },

  onleave(msg, opts) {
    if (opts.length < 1) return Reply.with(msg, lang.logs.use)
    let channel = Reply.strip(opts.shift())
    let message = opts.join(' ')
    message = message ? message : "{user.name} left."
    if (['off', 'false', 'disable'].includes(channel)) channel = false
    State.setConfig(msg.guild.id, 'onleave', { channel, message })
    if (!channel) return Reply.with(msg, lang.logs.off, 'onleave')
    else return Reply.with(msg, lang.logs.leave, message, channel)
  },

}