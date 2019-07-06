// Time Zoning Plugin
// Record Timezones from users,
// then display time relative to everyone.

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const Zones = require('../utils/zones.js')
const lang = require('../data/lang.json').zoning

module.exports = {

  // free commands can be used by anyone
  free: ['time', 'zones', 'zone'],

  time: function(msg, opts, test) {
    let user = State.find(msg.guild.id, 'zones', msg.author.id)
    if (!user) return Reply.to(msg, lang.time.none)

    let table = State.get(msg.guild.id, 'zones')
    let result = '', title = ''

    // if no opts, get time for right now
    if (!opts || !opts.length) {
      title = Reply.parse(lang.time.now)
      table = Zones.sortTable(table, 'now')
    } else if (opts.length == 1) {
      // otherwise try and guess a time
      let when = Zones.findWhen(opts[0], user.zone)
      if (!when) return Reply.to(msg, lang.time.lost, opts[0])

      title = Reply.parse(lang.time.then, opts[0])
      table = Zones.sortTable(table, when)
    } else return Reply.to(msg, lang.time.use)

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result += `**${t.time}** - `
      result += `${t.name.split('/')[1].split('_').join(' ')} `
      result += `(${t.users.length})\n`
    }

    Reply.embed(msg, title, result)
    return test ? false : msg.delete()
  },

  zones: function(msg, opts, test) {
    let result = { fields: [] }
    let zones = State.get(msg.guild.id, 'zones')
    let table = Zones.sortTable(zones, 'now')

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      let name = t.name.split('/')[1].split('_').join(' ')
      let temp = { name: `${t.time} - ${name}`, value: '', inline: true }
      for (var x in t.users) temp.value += `<@${t.users[x]}>\n`
      result.fields.push(temp)
    }
    let name = Reply.parse(lang.zones.name)
    let desc = Reply.parse(lang.zones.line)
    Reply.embed(msg, name, desc, result)
    return test ? false : msg.delete()
  },

  zone: function(msg, opts) {
    if (!opts) return Reply.to(msg, lang.zone.find)

    let zone = Zones.findZone(opts)
    if (!zone) return Reply.to(msg, lang.time.lost, opts.join(' '))
    State.push(msg.guild.id, 'zones', { id: msg.author.id, zone: zone.name })
    return Reply.to(msg, lang.zone.set, zone.name)
  },

  setzone: function(msg, opts) {
    if (!opts || opts.length < 2 || opts.length > 3) {
      return Reply.to(msg, lang.setzone.use)
    }

    let user = Reply.strip(opts.shift())
    let zone = Zones.findZone(opts)

    if (!zone) return Reply.to(msg, lang.time.lost, opts.join(' '))

    if (user.length != msg.author.id.length) {
      return Reply.to(msg, lang.time.lost, `${user} (userid)`)
    }

    State.push(msg.guild.id, 'zones', { id: user, zone: zone.name })
    return Reply.to(msg, lang.setzone.set, user, zone.name)
  }

}