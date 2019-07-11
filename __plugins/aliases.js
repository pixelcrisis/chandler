// Alias Command Plugin
// Set a string to return on a custom command.

const Reply = require('../utility/reply.js')
const State = require('../utility/state.js')
const lang = require('../data/lang.json').aliases

module.exports = {

  __run(msg, alias) {
    alias = State.getAlias(msg.guild.id, alias)
    if (alias) return msg.channel.send(alias.message)
  },

  alias(msg, opts) {
    if (opts.length < 2) return Reply.with(msg, lang.alias.use)
    let cant = [ 'alias', 'forget', 'prefix' ]

    let cmd = opts.shift()
    let opt = opts.join(' ')

    if (cant.includes(cmd)) return Reply.with(msg, lang.alias.bad)
    let old = State.getAlias(msg.guild.id, cmd)

    State.addAlias(msg.guild.id, cmd, opt)
    let response = old ? lang.alias.set : lang.alias.new
    return Reply.with(msg, response, cmd, opt)
  },

  forget(msg, opts) {
    if (opts.length != 1) return Reply.with(msg, lang.forget.use)
    let alias = State.getAlias(msg.guild.id, opts[0])
    if (alias) {
      State.remAlias(msg.guild.id, opts[0])
      return Reply.with(msg, lang.forget.rem, opts[0])
    }
    else return Reply.with(msg, lang.forget.bad, opts[0])
  },

  aliases(msg, opts) {
    let list = []
    let data = State.fetch(msg.guild.id, 'aliases')
    for (var i = 0; i < data.length; i++) {
      list.push("**" + data[i].id + "**: `" + data[i].message + "`")
    }
    if (!list.length) return Reply.with(msg, lang.none)
    else return Reply.list(msg, "Server Aliases", list, '\n')
  }

}