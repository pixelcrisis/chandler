// Custom Command Plugin
// Set a string to return on a custom command.

const Reply = require('../utils/reply.js')
const State = require('../utils/state.js')
const lang = require('../data/lang.json').custom

module.exports = {

  __run: function(msg, alias) {
    let cmds = State.get(msg.guild.id, 'comms')
    if (cmds[alias]) return msg.channel.send(cmds[alias])
  },

  alias: function(msg, opts) {
    if (opts.length < 2) return Reply.to(msg, lang.alias.use)
    let cmds = State.get(msg.guild.id, 'comms')
    let cant = [ 'alias', 'forget', 'prefix' ]

    let cmd = opts.shift()
    let opt = opts.join(' ')

    if (cant.includes(cmd)) return Reply.to(msg, lang.alias.bad)

    State.add(msg.guild.id, 'comms', cmd, opt)
    let response = cmds[cmd] ? lang.alias.set : lang.alias.new
    return Reply.to(msg, response, cmd, opt)
  },

  forget: function(msg, opts) {
    if (opts.length != 1) return Reply.to(msg, lang.forget.use)
    let cmds = State.get(msg.guild.id, 'comms')
    if (cmds[opts[0]]) {
      State.rem(msg.guild.id, 'comms', opts[0])
      return Reply.to(msg, lang.forget.rem, opts[0])
    } 
    else return Reply.to(msg, lang.forget.bad, opts[0])
  },

  aliases: function(msg, opts) {
    let response = ''
    let noAliases = Reply.parse(lang.none)
    let cmds = State.get(msg.guild.id, 'comms')

    for (var cmd in cmds) {
      response += Reply.parse(lang.list, cmd, cmds[cmd])
    }
    return msg.channel.send(response ? response : noAliases)
  }

}