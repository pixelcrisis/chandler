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
  Bot.commands = new Enmap()
  Bot.aliases  = new Enmap()

  Bot.confs = new Enmap({ name: 'confs', ...encfg })
  Bot.locks = new Enmap({ name: 'locks', ...encfg })
  Bot.zones = new Enmap({ name: 'zones', ...encfg })
  Bot.notes = new Enmap({ name: 'notes', ...encfg })
  Bot.votes = new Enmap({ name: 'votes', ...encfg })

  const loadFolder = async (folder, callback) => {
    const files = await readDir(folder)
    for (var i = 0; i < files.length; i++) { callback(files[i]) }
    return false
  }

  Bot.loadEvents = async () => {
    Bot.log('Loading Events...')
    const events = await loadFolder('./events/', (file) => {
      let name = file.split('.')[0]
      const event = require(`../events/${file}`)
      // bind events with `Bot`
      Bot.on(name, event.bind(null, Bot))
    })
    return false
  }

  Bot.loadCommands = async () => {
    const groups = await loadFolder('./commands/', async (group) => {
      // ignore template.js
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

  Bot.unloadCommand = (name) => {
    const cmd = Bot.findCommand(name)
    if (!cmd) return `Well ${name} didn't exist.`
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

  // handle node.js events
  process.on('uncaughtException', (error) => {
    Bot.log(`UNCAUGHT EXCEPTION\n\`\`\`${error.stack || error}\`\`\``)
  })

  process.on('unhandledRejection', (error) => {
    Bot.log(`UNHANDLED REJECTION\n\`\`\`${error.stack || error}\`\`\``)
  })

}