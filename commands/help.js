// help.js - for help with bot commands and info.

module.exports = {
  gate: 1,
  also: ['invite', 'support'],

  help: {
    name: "~/help (command)",
    desc: "Without a `command`, returns general help.\n" +
          "Otherwise, returns the help text for whichever `command`\n" +
          "{{ ~/help || ~/help list }}\n"
  },

  lang: {
    info: {
      color: 48268,
      name: "Chandler v{ver} Help",
      desc: "`~/commands` to see what commands you can use.\n" +
            "`~/help command` will return general help for `command`.\n" +
            "`~/time` will keep track of what time it is for everyone.\n"
    },
    more: "See and set config details with `~/set`\n" +
          "Set custom text commands with `~/note`\n" +
          "\nv2 Removed/Incomplete Commands:" +
          "{{ lock, unlock, rules, speak, shift }}\n",

    link: "[Online Docs]({docs}) | " +
          "[Invite Chandler]({invite}) | " +
          "[Support Server]({server})\n" +
          "*Make Requests In The Support Server!*"
  },

  fire: async function (Chandler, Msg) {
    let response = { ...this.lang.info }

    // only include 'more' if admin+
    if (Msg.access.level >= 5) response.desc += `\n${this.lang.more}\n`
    response.desc += `${this.lang.link}`

    // if no options, return the help
    if (!Msg.args.length) return Chandler.reply(Msg, response)

    // otherwise, try and find the command
    for (let name of Msg.args) {
      name = name.toLowerCase()
      // checked for a linked command first
      if (Chandler.linked[name]) {
        name = Chandler.linked[name].linked.split(' ')[0]
      }
      const command = Chandler.findCommand(name)
      if (command && Msg.access.level >= command.gate) {
        // replace the response with command specific help
        response = { ...command.help }

        // add the command aliases
        if (command.also) {
          let list = [ ...command.also ]
          response.desc += `\`*Also works:\` \`~/${list.join('` `~/')}\``
        }
        
        // the help that only shows for mods
        if (Msg.access.level >= 3 && response.mods) {
          response.desc += `\n${response.mods}`
          delete response.mods
        }
        
        // the help that only shows for admins
        if (Msg.access.level >= 5 && response.conf) {
          response.desc += `\n${response.conf}`
          delete response.conf
        }

        // add our links to it
        response.desc += `\n${this.lang.link}`
        return Chandler.reply(Msg, response)
      }
    }
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = []
    await this.fire(Chandler, Msg)

    Msg.args = ['help']
    await this.fire(Chandler, Msg)
  }
}