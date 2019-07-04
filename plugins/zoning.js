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

  time: async function(msg, opts) {
    let user = await DB.find(msg.guild.id, 'zones', msg.author.id)
    if (!user) {
      let response = Util.parse(lang.unset)
      return msg.channel.send(response)
    }

    let table = await DB.get(msg.guild.id, 'zones')
    let result = '', title = ''

    // if no opts, get time for right now
    if (!opts || !opts.length) {
      title = 'Current Time'
      table = Time.sortTable(table, 'now')
    } else if (opts.length == 1) {
      // otherwise try and guess a time
      let when = Time.findWhen(opts[0], user.zone)
      if (!when) {
        let response = Util.parse(lang.lost, opts[0])
        return msg.channel.send(response)
      }
      title = `Time at ${opts[0]}`
      table = Time.sortTable(table, when)
    }

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      result += `**${t.time}** - `
      result += `${t.name.split('/')[1].split('_').join(' ')} `
      result += `(${t.users.length})\n`
    }
    msg.channel.send(Util.box(result, title))
    msg.delete()
  },

  zones: async function(msg, opts) {
    let result = { fields: [] }
    let zones = await DB.get(msg.guild.id, 'zones')
    let table = Time.sortTable(zones, 'now')

    for (var i = 0; i < table.length; i++) {
      let t = table[i]
      let name = t.name.split('/')[1].split('_').join(' ')
      let temp = { name: `${t.time} - ${name}`, value: '', inline: true }
      for (var x in t.users) temp.value += `<@${t.users[x]}>\n`
      result.fields.push(temp)
    }
    msg.channel.send(Util.box('---', "Active Time Zones", result))
    msg.delete()
  },

  zone: function(msg, opts) {
    if (!opts || !opts.length) {
      let response = Util.parse(lang.findZone)
      return msg.channel.send(response)
    }

    let wUsr = (opts.length == 2)
    let user = wUsr ? Util.strip(opts.shift()) : msg.author.id
    let zone = Time.findZone(opts)

    if (!zone) {
      let response = Util.parse(lang.lost, opts)
      return msg.channel.send(response)
    }

    if (user.length != msg.author.id.length) {
      let response = Util.parse(lang.lost, `${user} (userid)`)
      return msg.channel.send(response)
    }

    DB.add(msg.guild.id, 'zones', { id: user, zone: zone.name })
    let response = Util.parse(lang.setZone, zone.name)
    return msg.channel.send(response)
  }

}