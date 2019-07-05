// Time Zoning Plugin
// Record Timezones from users,
// then display time relative to everyone.

const Utils = require('../utils/utils.js')
const State = require('../utils/state.js')
const Embed = require('../utils/embed.js')
const Zones = require('../utils/zones.js')
const lang = require('../data/lang.json').zoning

module.exports = {

  // free commands can be used by anyone
  free: ['time', 'zones', 'zone'],

  time: function(msg, opts) {
    let none = $.parse(lang.time.none)
    let user = State.find(msg.guild.id, 'zones', msg.author.id)
    if (!user) return msg.channel.send(none)

    let table = State.get(msg.guild.id, 'zones')
    let result = '', title = ''

    // if no opts, get time for right now
    if (!opts || !opts.length) {
      title = $.parse(lang.time.now)
      table = Zones.sortTable(table, 'now')
    } else if (opts.length == 1) {
      // otherwise try and guess a time
      let when = Zones.findWhen(opts[0], user.zone)
      if (!when) {
        let noTime = $.parse(lang.time.lost, opts[0])
        return msg.channel.send(noTime)
      }
      title = $.parse(lang.time.then, opts[0])
      table = Zones.sortTable(table, when)
    }

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result += `**${t.time}** - `
      result += `${t.name.split('/')[1].split('_').join(' ')} `
      result += `(${t.users.length})\n`
    }
    let embed = Embed.create(result, title)
    msg.channel.send(embed)
    msg.delete()
  },

  zones: function(msg, opts) {
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
    let name = $.parse(lang.zones.name)
    let desc = $.parse(lang.zones.line)
    let embed = Embed.create(desc, name, result)
    msg.channel.send(embed)
    msg.delete()
  },

  zone: function(msg, opts) {
    let none = $.parse(lang.zone.find)
    if (!opts || !opts.length) return msg.channel.send(none)

    let zone = Zones.findZone(opts)
    if (!zone) {
      let noZone = $.parse(lang.time.lost, opts)
      return msg.channel.send(noZone)
    }
    State.push(msg.guild.id, 'zones', { id: msg.author.id, zone: zone.name })
    let setZone = $.parse(lang.zone.set, zone.name)
    return msg.channel.send(setZone)
  },

  setzone: function(msg, opts) {
    let useage = $.parse(lang.setzone.use)
    if (!opts || opts.length < 2 || opts.length > 3) {
      return msg.channel.send(useage)
    }

    let user = $.strip(opts.shift())
    let zone = Zones.findZone(opts)

    if (!zone) {
      let noZone = $.parse(lang.time.lost, opts)
      return msg.channel.send(noZone)
    }

    if (user.length != msg.author.id.length) {
      let noUser = $.parse(lang.time.lost, `${user} (userid)`)
      return msg.channel.send(noUser)
    }

    State.push(msg.guild.id, 'zones', { id: user, zone: zone.name })
    let setZone = $.parse(lang.setzone.set, user, zone.name)
    return msg.channel.send(setZone)
  }

}