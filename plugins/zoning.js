// Time Zoning Plugin
// Record Timezones from users,
// then display time relative to everyone.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const Time = require('../utils/time.js')
const lang = require('../data/lang.json').zoning

module.exports = {

  // free commands can be used by anyone
  free: ['time', 'zones', 'zone'],

  time: function(msg, opts) {
    let none = Util.parse(lang.time.none)
    let user = DB.find(msg.guild.id, 'zones', msg.author.id)
    if (!user) return msg.channel.send(none)

    let table = DB.get(msg.guild.id, 'zones')
    let result = '', title = ''

    // if no opts, get time for right now
    if (!opts || !opts.length) {
      title = Util.parse(lang.time.now)
      table = Time.sortTable(table, 'now')
    } else if (opts.length == 1) {
      // otherwise try and guess a time
      let when = Time.findWhen(opts[0], user.zone)
      if (!when) {
        let noTime = Util.parse(lang.time.lost, opts[0])
        return msg.channel.send(noTime)
      }
      title = Util.parse(lang.time.then, opts[0])
      table = Time.sortTable(table, when)
    }

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result += `**${t.time}** - `
      result += `${t.name.split('/')[1].split('_').join(' ')} `
      result += `(${t.users.length})\n`
    }
    let embed = Util.box(result, title)
    msg.channel.send(embed)
    msg.delete()
  },

  zones: function(msg, opts) {
    let result = { fields: [] }
    let zones = DB.get(msg.guild.id, 'zones')
    let table = Time.sortTable(zones, 'now')

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      let name = t.name.split('/')[1].split('_').join(' ')
      let temp = { name: `${t.time} - ${name}`, value: '', inline: true }
      for (var x in t.users) temp.value += `<@${t.users[x]}>\n`
      result.fields.push(temp)
    }
    let name = Util.parse(lang.zones.name)
    let desc = Util.parse(lang.zones.line)
    let embed = Util.box(desc, name, result)
    msg.channel.send(embed)
    msg.delete()
  },

  zone: function(msg, opts) {
    let none = Util.parse(lang.zone.find)
    if (!opts || !opts.length) return msg.channel.send(none)

    let zone = Time.findZone(opts)
    if (!zone) {
      let noZone = Util.parse(lang.time.lost, opts)
      return msg.channel.send(noZone)
    }
    DB.push(msg.guild.id, 'zones', { id: msg.author.id, zone: zone.name })
    let setZone = Util.parse(lang.zone.set, zone.name)
    return msg.channel.send(setZone)
  },

  setzone: function(msg, opts) {
    let useage = Util.parse(lang.setzone.use)
    if (!opts || opts.length < 2 || opts.length > 3) {
      return msg.channel.send(useage)
    }

    let user = Util.strip(opts.shift())
    let zone = Time.findZone(opts)

    if (!zone) {
      let noZone = Util.parse(lang.time.lost, opts)
      return msg.channel.send(noZone)
    }

    if (user.length != msg.author.id.length) {
      let noUser = Util.parse(lang.time.lost, `${user} (userid)`)
      return msg.channel.send(noUser)
    }

    DB.push(msg.guild.id, 'zones', { id: user, zone: zone.name })
    let setZone = Util.parse(lang.setzone.set, user, zone.name)
    return msg.channel.send(setZone)
  }

}