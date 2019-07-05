// Management Plugin
// For Managing Chandler/Servers

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').manage

module.exports = {

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
  },

  clear: function(msg, opts) {
    let useage = Util.parse(lang.clear)
    if (opts.length !== 1) return msg.channel.send(useage)
    msg.channel.fetchMessages({ limit: opts[0] + 1 })
      .then(got => { msg.channel.bulkDelete(got) })
  }

}