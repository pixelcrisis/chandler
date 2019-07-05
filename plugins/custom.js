// Custom Command Plugin
// Set a string to return on a custom command.

const DB   = require('../utils/db.js')
const Util = require('../utils/util.js')
const lang = require('../data/lang.json').custom

module.exports = {

  __run: function(msg, alias) {
    let cmds = DB.get(msg.guild.id, 'comms')
    if (cmds[alias]) msg.channel.send(cmds[alias])
  },

  alias: function(msg, opts) {
    let useage = Util.parse(lang.alias.use)
    if (opts.length < 2) return msg.channel.send(useage)
    let cmds = DB.get(msg.guild.id, 'comms')
    let cant = [ 'alias', 'forget', 'prefix' ]

    let cmd = opts.shift()
    let opt = opts.join(' ')

    let bad = false
    if (cant.includes(cmd)) bad = Util.parse(lang.alias.bad, cmd)
    if (bad) return msg.channel.send(bad)

    DB.add(msg.guild.id, 'comms', cmd, opt)
    let response = cmds[cmd] ? lang.alias.set : lang.alias.new
    let setAlias = Util.parse(response, cmd, opt)
    return msg.channel.send(setAlias)
  },

  forget: function(msg, opts) {
    let useage = Util.parse(lang.forget.use)
    if (opts.length != 1) return msg.channel.send(useage)
    let cmds = DB.get(msg.guild.id, 'comms')
    if (cmds[opts[0]]) {
      DB.rem(msg.guild.id, 'comms', opts[0])
      let removed = Util.parse(lang.forget.rem, opts[0])
      return msg.channel.send(removed)
    } else {
      let noAlias = Util.parse(lang.forget.bad, opts[0])
      return msg.channel.send(noAlias)
    }
  },

  aliases: function(msg, opts) {
    let noAliases = Util.parse(lang.none)
    let cmds = DB.get(msg.guild.id, 'comms')

    let response = ''
    for (var cmd in cmds) {
      response += Util.parse(lang.list, cmd, cmds[cmd])
    }
    return msg.channel.send(response ? response : noAliases)
  }

}