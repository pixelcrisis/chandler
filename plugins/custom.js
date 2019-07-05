// Custom Command Plugin
// Set a string to return on a custom command.

const Utils = require('../utils/utils.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').custom

module.exports = {

  __run: function(msg, alias) {
    let cmds = State.get(msg.guild.id, 'comms')
    if (cmds[alias]) msg.channel.send(cmds[alias])
  },

  alias: function(msg, opts) {
    let useage = Utils.parse(lang.alias.use)
    if (opts.length < 2) return msg.channel.send(useage)
    let cmds = State.get(msg.guild.id, 'comms')
    let cant = [ 'alias', 'forget', 'prefix' ]

    let cmd = opts.shift()
    let opt = opts.join(' ')

    let bad = false
    if (cant.includes(cmd)) bad = Utils.parse(lang.alias.bad, cmd)
    if (bad) return msg.channel.send(bad)

    State.add(msg.guild.id, 'comms', cmd, opt)
    let response = cmds[cmd] ? lang.alias.set : lang.alias.new
    let setAlias = Utils.parse(response, cmd, opt)
    return msg.channel.send(setAlias)
  },

  forget: function(msg, opts) {
    let useage = Utils.parse(lang.forget.use)
    if (opts.length != 1) return msg.channel.send(useage)
    let cmds = State.get(msg.guild.id, 'comms')
    if (cmds[opts[0]]) {
      State.rem(msg.guild.id, 'comms', opts[0])
      let removed = Utils.parse(lang.forget.rem, opts[0])
      return msg.channel.send(removed)
    } else {
      let noAlias = Utils.parse(lang.forget.bad, opts[0])
      return msg.channel.send(noAlias)
    }
  },

  aliases: function(msg, opts) {
    let noAliases = Utils.parse(lang.none)
    let cmds = State.get(msg.guild.id, 'comms')

    let response = ''
    for (var cmd in cmds) {
      response += Utils.parse(lang.list, cmd, cmds[cmd])
    }
    return msg.channel.send(response ? response : noAliases)
  }

}