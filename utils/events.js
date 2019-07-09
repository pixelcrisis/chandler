// Event Utilities

const State = require('./state.js')
const Tests = require('./tests.js')

module.exports = {

  ready: false,
  logID: false,

  log(msg) {
    console.info(msg)
    if (this.logID) this.logID.send(msg)
  },

  async updateGuilds(Client, guild) {
    let guilds = Client.guilds.keyArray()
    Client.user.setActivity(`${guilds.length} Servers.`, {
      type: 'LISTENING'
    })
    if (guild) {
      if (!guild.deleted) {
        await State.load(guild.id)
      this.log(`Added to ${guild.name} : ${guild.id}`)
      }
      else this.log(`Removed from ${guild.name} : ${guild.id}`)
    } 
    return guilds
  },

  async onBoot(Client, config) {
    this.owner = config.owner
    this.server = config.server
    this.serverLogID = config.serverLogID
    if (this.server && this.serverLogID) {
      this.logID = Client.channels.get(this.serverLogID)
    }
    this.log("Booting: Loading Guilds...")
    let guilds = await this.updateGuilds(Client)
    await State.loadAll(guilds)
    this.log(`Booted: Loaded ${guilds.length} Guilds.`)
    this.ready = true
  },

  async onMessage(msg, plugins) {
    if (!this.ready || !msg.member || msg.author.bot) return
    let modID  = State.get(msg.guild.id, 'modID')
    let prefix = State.get(msg.guild.id, 'prefix')
    if (msg.content.indexOf(prefix) !== 0) return

    let opts = msg.content.slice(prefix.length).trim().split(/ +/g)
    let cmd  = opts.shift().toLowerCase()

    if (cmd == 'test' && msg.member.user.id == this.owner) {
      this.ready = false
      await Tests.run(msg, opts, plugins)
      this.ready = true
    }

    const hasPerms = plugin => {
      if (plugin.free && plugin.free.includes(cmd)) return true
      if (msg.member.user.id == msg.member.guild.ownerID) return true
      return msg.member.roles.has(modID)
    }

    for (const plug in plugins) {
      if (plugins[plug][cmd] && hasPerms(plugins[plug])) {
        return plugins[plug][cmd](msg, opts)
      }
    }

    plugins['aliases'].__run(msg, cmd)
  }

}