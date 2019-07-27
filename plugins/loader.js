// Chandler Loader
// Loads Command/Event files
// Loads Data

const { promisify } = require("util")
const readDir = promisify(require("fs").readdir)
const Enmap = require('enmap')
const encfg = { fetchAll: false, autoFetch: true, cloneLevel: 'deep' }

module.exports = (Bot) => {

  require('./dbl.js')(Bot)

  require('./reply.js')(Bot)
  require('./utils.js')(Bot)
  require('./zones.js')(Bot)

  // load our data objects
  Bot.confs = new Enmap({ name: 'confs', ...encfg })
  Bot.locks = new Enmap({ name: 'locks', ...encfg })
  Bot.zones = new Enmap({ name: 'zones', ...encfg })
  Bot.notes = new Enmap({ name: 'notes', ...encfg })
  Bot.votes = new Enmap({ name: 'votes', ...encfg })

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

  // handle node.js events
  process.on('uncaughtException', (error) => {
    Bot.log(`UNCAUGHT EXCEPTION\n\`\`\`${error.stack || error}\`\`\``)
  })

  process.on('unhandledRejection', (error) => {
    Bot.log(`UNHANDLED REJECTION\n\`\`\`${error.stack || error}\`\`\``)
  })

}