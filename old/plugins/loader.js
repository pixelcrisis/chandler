// Chandler Loader
// Loads Command/Event files
// Loads Data

const { promisify } = require("util")
const readDir = promisify(require("fs").readdir)
const Enmap = require('enmap')

module.exports = (Bot) => {

  require('./dbl.js')(Bot)

  require('./state.js')(Bot)
  require('./reply.js')(Bot)
  require('./utils.js')(Bot)
  require('./zones.js')(Bot)

  Bot.commands = new Enmap()
  Bot.aliases  = new Enmap()

  const loadFolder = async (folder, callback) => {
    const files = await readDir(folder)
    for (let i = 0; i < files.length; i++) { callback(files[i]) }
    return false
  }

  Bot.loadEvents = async () => {
    Bot.log('Loading Events...')
    const events = await loadFolder('./events/', (file) => {
      let name = file.split('.')[0]
      const event = require(`../events/${file}`)
      Bot.on(name, event.bind(null, Bot))
    })
    return false
  }

  Bot.loadCommands = async () => {
    const groups = await loadFolder('./commands/', async (group) => {
      if (group.endsWith('.js')) return
      Bot.log(`Loading Command Group: ` + group)
      const command = await loadFolder(`./commands/${group}`, (file) => {
        Bot.loadCommand(group, file)
      })
    })
    return false
  }

  Bot.loadCommand = (group, name) => {
    console.info(`Loading Command: ${name}`)
    const cmd = require(`../commands/${group}/${name}`)
    cmd.group = group
    Bot.commands.set(cmd.name, cmd)
    if (cmd.alias) cmd.alias.forEach((alias) => {
      Bot.aliases.set(alias, cmd.name)
    })
  }

  Bot.findCommand = (name) => {
    return Bot.commands.get(name) || Bot.commands.get(Bot.aliases.get(name))
  }

  Bot.unloadCommand = (cmd) => {
    let path = `../commands/${cmd.group}/${cmd.name}`
    const old = require.cache[require.resolve(path)];
    delete require.cache[require.resolve(`${path}.js`)];
    for (let i = 0; i < old.parent.children.length; i++) {
      if (old.parent.children[i] === old) {
        old.parent.children.splice(i, 1);
        break;
      }
    }
    return false
  }

  process.on('uncaughtException', (error) => {
    Bot.log(`UNCAUGHT EXCEPTION\n\`\`\`${error.stack || error}\`\`\``)
  })

  process.on('unhandledRejection', (error) => {
    if (error.method == 'DELETE') return
    Bot.log(`UNHANDLED REJECTION\n\`\`\`${error.stack || error}\`\`\``)
  })

}