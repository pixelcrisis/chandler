// loader.js - Loads plugins, events, commands 

const { promisify } = require('util')
const readDirectory = promisify(require('fs').readdir)

// define a load folder helper
// read every file in a directory,
// load that file and apply a callback
const loadFolder = async (folder, cb) => {
  const files = await readDirectory(folder)
  files.forEach(file => cb(file.split('.')[0], require(`${folder}/${file}`)))
}

module.exports = Chandler => {

  Chandler.aka = {}
  Chandler.linked = {}
  Chandler.commands = {}

  // Using the loadFolder helper above,
  // We Quickly load several folders worth of files!

  Chandler.loadPlugins = async () => {
    const cb = (name, plugin) => plugin(Chandler)
    const plugins = await loadFolder('./plugins/', cb)
  }

  Chandler.loadEvents = async () => {
    const cb = (name, event) => Chandler.on(name, event.bind(null, Chandler))
    const events = await loadFolder('./events/', cb)
  }

  Chandler.loadCommands = async () => {
    const cb = (name, cmd) => {
      Chandler.commands[name] = cmd
      if (cmd.also) cmd.also.forEach(also => Chandler.aka[also] = name)
      if (cmd.link) Chandler.linked = { ...Chandler.linked, ...cmd.link }
    }
    const commands = await loadFolder('./commands/', cb)
  }

  // Might as well define these now
  // Chandler.post() is available in plugins/logging.js

  Chandler.loadHandlers = async () => {
    process.on('uncaughtException',  err => Chandler.post(err, 'Exception'))
    process.on('unhandledRejection', err => Chandler.post(err, 'Rejection'))
  }

}