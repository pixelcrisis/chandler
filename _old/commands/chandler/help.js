module.exports = {

  name: 'help',
  
  level: 1,
  alias: [ 'invite', 'support' ],

  lang: {
    help: {
      color: 48268,
      name: "Chandler Help",
      desc: "`{pre}commands` to see commands you can use.\n" +
            "`{pre}help command` will help with any `command`\n\n" +
            "Track times with `{pre}time` and `{pre}zone`\n\n" +
            "{val1} {val2}"
    },
    links: "\n\n[Docs]({docs}) | [Invite Me]({invite}) | " +
          "[Help Server]({server}) | {love}",
    extra: "See config details with `{pre}status`\n" +
           "Set custom commands with `{pre}help note`\n" +
           "Set your server rules with `{pre}help rules`"
  },

  help: {
    name: "{pre}help (command)",
    desc: "Without a `command`, returns general support information. " +
          "Otherwise, returns the help documentation for `command`"
  },

  fire: function(Bot, msg, opts, access) {
    if (!opts.length) {
      // if no command specified,
      // print the general response
      // include status command if admin+
      let extra = access >= 5 ? this.lang.extra : ''
      return Bot.reply(msg, this.lang.help, extra, this.lang.links)
    }
    // otherwise get the help message for a command
    else if (opts.length == 1) {
      let cmd = Bot.findCommand(opts[0])
      if (cmd && access >= cmd.level) {
        let help = cmd.help
        if (cmd.helpMod && access >= 3) help = cmd.helpMod
        if (cmd.helpAdmin && access >= 5) help = cmd.helpAdmin
        help.desc += this.lang.links
        return Bot.reply(msg, help)
      }
    }
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}help",
      desc: "`{pre}help` - Links\n" +
            "`{pre}help help` - Help\n" +
            "`{pre}help test` - Nothing (level 7)\n" +
            "`{pre}help test` - Help (level 9)",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['help'], 1)
    await this.fire(Bot, msg, ['test'], 7)
    await this.fire(Bot, msg, ['test'], 9)

    return Bot.reply(msg, "{pre}help test complete.")
  }

}