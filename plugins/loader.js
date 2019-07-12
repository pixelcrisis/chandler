// Chandler File Loader
// Loading Commands/Events

const { promisify } = require("util")
const readDir = promisify(require("fs").readdir)

module.exports = (Bot) => {

  Bot.aliases = {}
  Bot.commands = {}

  Bot.loadEvents = async () => {
    const files = await readDir('./events/')
    Bot.log(`Loading ${files.length} Events...`)
    for (var i = 0; i < files.length; i++) {
      let name = files[i].split('.')[0]
      const event = require(`../events/${files[i]}`)
      // bind events with `Bot` automagically
      Bot.on(name, event.bind(null, Bot))
    }
  },

  Bot.loadCommands = async () => {
    const groups = await readDir('./commands/')
    Bot.log(`Loading ${groups.length} Command Groups...`)
    for (var g = 0; g < groups.length; g++) {
      const files = await readDir(`./commands/${groups[g]}`)
      Bot.log(`Loading ${files.length} Commands From Group: ${groups[g]}`)
      for (var f = 0; f < files.length; f++) {
        const command = require(`../commands/${groups[g]}/${files[f]}`)
        Bot.commands[command.name] = command  
        if (command.alias) {
          for (var i = 0; i < command.alias.length; i++) {
            Bot.aliases[command.alias[i]] = command.name
          }
        }
      }
    }
  }

  Bot.findCommand = (cmd) => {
    return Bot.commands[cmd] || Bot.commands[Bot.aliases[cmd]]
  }

}