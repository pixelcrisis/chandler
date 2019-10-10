// loader.js
// loads plugins, events, commands

const { promisify } = require('util')
const readDirectory = promisify(require('fs').readdir)

module.exports = Bot => {

  Bot.aliases  = {}
  Bot.commands = {}

  const loadFolder = async (folder, callback) => {
    const files = await readDirectory(folder)
    files.forEach(file => callback(file))
  }

  Bot.loadPlugins = async () => {
    const plugins = await loadFolder('./plugins/', file => {
      require(`./plugins/${file}`)(Bot)
    })
  }

  Bot.loadEvents = async () => {
    const events = await loadFolder('./events/', file => {
      const event = require(`./events/${file}`)
      Bot.on(file.split('.')[0], event.bind(null, Bot))
    })
  }

  Bot.loadCommands = async () => {
    const groups = await loadFolder('./commands/', async group => {
      const commands = await loadFolder(`./commands/${group}`, file => {
        const cmd = require(`./commands/${group}/${file}`)
        Bot.commands[cmd.name] = cmd
        if (cmd.alias) cmd.alias.forEach(alias => Bot.aliases[alias] = cmd.name)
      })
    })
  }

  // load error handling
  process.on('uncaughtException',  err => Bot.log('Exception: ', err))
  process.on('unhandledRejection', err => Bot.log('Rejection: ', err))

}