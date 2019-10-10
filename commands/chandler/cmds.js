module.exports = {
  
  name: 'cmds',
  level: 1,
  alias: ['commands'],

  help: {
    name: "{pre}cmds",
    desc: "Prints a list of commands you have access to."
  },

  fire: async function (Bot, evt) {
    let commands = {}
    let response = { name: "Chandler Commands", desc: [] }

    for (const name in Bot.commands) {
      const command = Bot.commands[name]
      if (evt.access.level >= command.level) {
        const access = Bot.accessLevels[command.level].name
        if (!commands[access]) commands[access] = [ name ]
        else commands[access].push(name)
      }
    }

    for (const access in commands) {
      response.desc.push(`**${access}**: ${commands[access].join(', ')}`)
    }

    response.desc.push('\n`{pre}help command` for more.')

    return Bot.reply(evt, response)
  },

  test: async function (Bot, evt, data) {
    evt.access.level = 1
    await this.fire(Bot, evt)
    
    evt.access.level = 9
    await this.fire(Bot, evt)
  }

}