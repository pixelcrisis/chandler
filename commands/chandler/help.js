module.exports = {
  
  name: 'help',
  level: 1,
  alias: ['invite', 'support'],

  help: {
    name: "{pre}help (command)",
    desc: "Without a `command`, returns general help. " +
          "Otherwise, returns the help information for `command`"
  },

  lang: {
    foot: "[Docs]({docs}) | [Invite Me]({invite}) | [Help Server]({server}) | {love}",
    more: "See config details with `{pre}status`\n" +
          "Set custom command with `{pre}help note`\n" +
          "Set server rules with `{pre}help rules`",
    help: {
      color: 48268,
      name: "Chandler Help",
      desc: "`{pre}commands` to see what commands you can use.\n" +
            "`{pre}help command` will help you with any `command`."
    },
  },

  fire: async function (Bot, evt) {
    let level = evt.access.level, help = this.lang.help
    let more = level >= 5 ? `\n\n${this.lang.more}` : ''
    help.desc += `${more}\n\n${this.lang.foot}`
    if (!evt.options.length) return Bot.reply(evt, help)

    for (const name of evt.options) {
      let cmd = Bot.findCommand(name)
      if (cmd && level >= cmd.level) {
        help = cmd.help
        if (cmd.setup && level >= 3) help = cmd.setup
        if (cmd.admin && level >= 5) help = cmd.admin
        help.desc += `\n\n${this.lang.foot}`
        return Bot.reply(evt, help)
      }
    }
  },

  test: async function (Bot, evt, data) {
    evt.options = []
    await this.fire(Bot, evt)
    
    evt.options = ['help']
    await this.fire(Bot, evt)
  }

}