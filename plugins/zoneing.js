// Time Zoneing Plugin
// Record Timezones from users,
// then display time relative to everyone.

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const Zones = require('../utils/zones.js')
const lang = require('../data/lang.json').zoneing

module.exports = {

  // free commands can be used by anyone
  free: ['time', 'zones', 'zone'],

  time(msg, opts, test) {
    let user = State.find(msg.guild.id, 'zones', msg.author.id)
    if (!user) return Reply.with(msg, lang.time.none)

    let table = State.get(msg.guild.id, 'zones')
    let result = '', title = ''

    // if no opts, get time for right now
    if (!opts || !opts.length) {
      title = Reply.parse(lang.time.now)
      table = Zones.sortTable(table, 'now')
    } else if (opts.length == 1) {
      // otherwise try and guess a time
      let when = Zones.findWhen(opts[0], user.zone)
      if (!when) return Reply.with(msg, lang.time.lost, opts[0])

      title = Reply.parse(lang.time.then, opts[0])
      table = Zones.sortTable(table, when)
    } else return Reply.with(msg, lang.time.use)

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result += `**${t.time}** - `
      result += `${t.name.split('/')[1].split('_').join(' ')} `
      result += `(${t.users.length})\n`
    }

    Reply.with(msg, { name: title, desc: result })
    return test ? false : msg.delete()
  },

  zones(msg, opts, test) {
    let result = []
    let zones = State.get(msg.guild.id, 'zones')
    let table = Zones.sortTable(zones, 'now')

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      let name = t.name.split('/')[1].split('_').join(' ')
      let temp = { name: `${t.time} - ${name}`, value: '', inline: true }
      for (var x in t.users) temp.value += `<@${t.users[x]}>\n`
      result.push(temp)
    }
    Reply.with(msg, {
      name: lang.zones.name,
      desc: lang.zones.line,
      fields: result
    })
    return test ? false : msg.delete()
  },

  zone(msg, opts) {
    if (!opts.length) return Reply.with(msg, lang.zone.find)

    let zone = Zones.findZone(opts)
    if (!zone) return Reply.with(msg, lang.time.lost, opts.join(' '))
    State.push(msg.guild.id, 'zones', { id: msg.author.id, zone: zone.name })
    return Reply.with(msg, lang.zone.set, zone.name)
  },

  setzone(msg, opts) {
    if (!opts || opts.length < 2 || opts.length > 3) {
      return Reply.with(msg, lang.setzone.use)
    }

    let user = Reply.strip(opts.shift())
    let zone = Zones.findZone(opts)

    if (!zone) return Reply.with(msg, lang.time.lost, opts.join(' '))

    if (user.length != msg.author.id.length) {
      return Reply.with(msg, lang.time.lost, `${user} (userid)`)
    }

    State.push(msg.guild.id, 'zones', { id: user, zone: zone.name })
    return Reply.with(msg, lang.setzone.set, user, zone.name)
  }

}