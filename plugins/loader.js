// Chandler Loader
// Loading Commands/Events

const { promisify } = require("util")
const readDir = promisify(require("fs").readdir)

module.exports = {

  async events() {
    const files = await readDir('./events/')
    this.log(`Loading ${files.length} Events...`)
    for (var i = 0; i < files.length; i++) {
      let name = files[i].split('.')[0]
      const event = require(`../events/${files[i]}`)
      // bind event with `Bot` (this)
      this.on(name, event.bind(null, this))
    }
  },

  async commands() {
    const groups = await readDir('./commands/')
    this.log(`Loading ${groups.length} Command Groups...`)
    for (var g = 0; g < groups.length; g++) {
      const files = await readDir(`./commands/${groups[g]}`)
      this.log(`Loading ${files.length} Commands From Group: ${groups[g]}`)
      for (var f = 0; f < files.length; f++) {
        const command = require(`../commands/${groups[g]}/${files[f]}`)
        return this.commands[command.name] = command  
      }
    }
  },

  async guilds() {
    
  }

}