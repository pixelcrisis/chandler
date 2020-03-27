// cmds.js - for listing commands

module.exports = {
  gate: 1,
  also: ['commands'],

  help: {
    name: "~/commands",
    desc: "Lists the commands that you have access to."
  },

  lang: {
    prefix: "**Prefix**: `~/`",
    help: "Use `~/help command` for specific info."
  },

  fire: async function (Chandler, Msg) {
    let commands = {}
    let response = { name: 'Chandler Commands', desc: '' }

    // function to push the command to commands
    const addCommand = (gate, name) => {
      // don't list if they can't use it
      if (Msg.access.level < gate) return
      // get the proper name for this level
      const access = Chandler.badges[gate].name

      if (!commands[access]) commands[access] = [ name ]
      else commands[access].push(name)
    }

    // Loop through all of the possible commands
    for (const name in Chandler.commands) {
      const command = Chandler.commands[name]

      // just add the command if no links
      if (!command.link) addCommand(command.gate, name)
      else for (const link in command.link) {
        // otherwise, add the linked subcommands
        addCommand(command.link[link].access, link)
      }
    }

    // Add notes
    const notes = Chandler.$get('notes', Msg)
    if (notes) {
      commands['Notes'] = []
      for (const title in notes) commands['Notes'].push(title)
    }

    // Add the sorted commands to our response
    for (const access in commands) {
      response.desc += `**${access}**: ${commands[access].join(', ')}\n`
    }

    // add our suffix to our batch, add batch to response
    response.desc += `\n${this.lang.prefix} - ${this.lang.help}`

    return Chandler.reply(Msg, response)
  },

  test: async function (Chandler, Msg, data) {
    Msg.access.level = 1
    await this.fire(Chandler, Msg)

    Msg.access.level = 9
    await this.fire(Chandler, Msg)
  }
}