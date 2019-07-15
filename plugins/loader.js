// Chandler File Loader
// Loading Commands/Events

const { promisify } = require("util")
const readDir = promisify(require("fs").readdir)

module.exports = (Bot) => {

  require('./reply.js')(Bot)
  require('./utils.js')(Bot)
  require('./state.js')(Bot)
  require('./zones.js')(Bot)

  Bot.loadEvents = async () => {
    const files = await readDir('./events/')
    Bot.log(`Loading ${files.length} Events...`)
    for (var i = 0; i < files.length; i++) {
      let name = files[i].split('.')[0]
      const event = require(`../events/${files[i]}`)
      // bind events with `Bot` automagically
      Bot.on(name, event.bind(null, Bot))
    }
  }

  // handle node.js events
  process.on('uncaughtException', (error) => {
    Bot.log(`UNCAUGHT EXCEPTION\n\n${error}`)
  })

  process.on('unhandledRejection', (error) => {
    Bot.log(`UNHANDLED REJECTION\n\n${error}`)
  })

  Bot.aliases = {}
  Bot.commands = {}

  Bot.loadCommands = async () => {
    let total = 0
    const groups = await readDir('./commands/')
    // ignore template.js in count
    Bot.log(`Loading ${groups.length - 1} Command Groups...`)
    for (var g = 0; g < groups.length; g++) {
      // ignore template.js in processing
      if (!groups[g].endsWith('.js')) {
        const files = await readDir(`./commands/${groups[g]}`)
        total += files.length
        Bot.log(`Loading ${files.length} Commands From Group: ${groups[g]}`)
        for (var f = 0; f < files.length; f++) {
          const command = require(`../commands/${groups[g]}/${files[f]}`)
          Bot.commands[command.name] = command
          Bot.commands[command.name].group = groups[g]
          if (command.alias) {
            for (var i = 0; i < command.alias.length; i++) {
              Bot.aliases[command.alias[i]] = command.name
            }
          }
        }
      }
    }
    Bot.log(`Loaded ${total} Commands Total.`)
  }

}