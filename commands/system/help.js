module.exports = {

  name: 'help',
  
  level: 1,
  alias: [ 'invite' ],

  resp: {
    name: "Chandler Help",
    desc: "View the {website} for Docs\n" +
          "Join the {support} for Help\n" +
          "Or, {invite} to your server!\n\n" +
          "`{pre}help command` will help with a `command`\n"
  },

  help: {
    name: "{pre}help (command)",
    desc: "Without a `command`, returns a link to the website and support server. " +
          "Otherwise, returns the help documentation for `command`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) {
      // if no command specified,
      // print the general response
      return Bot.reply(msg, this.resp)
    }
    // otherwise get the help message for a command
    else if (opts.length == 1) {
      let cmd = Bot.findCommand(opts[0])
      if (cmd && lvl >= cmd.level) return Bot.reply(msg, cmd.help)
    }
  },

  test: async function(Bot, msg) {
    Bot.reply(msg, {
      name: "Testing {pre}help",
      desc: "`{pre}help` - Links\n" +
            "`{pre}help help` - Useage\n" +
            "`{pre}help test` - Nothing (Perms 7)\n" +
            "`{pre}help test` - Useage",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['help'], 1)
    await this.fire(Bot, msg, ['test'], 7)
    await this.fire(Bot, msg, ['test'], 9)
  }

}