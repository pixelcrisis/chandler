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

  async onBoot(Client, config) {
    this.owner = config.owner
    this.server = config.server
    this.serverLogID = config.serverLogID
    if (this.server && this.serverLogID) {
      this.logID = Client.channels.get(this.serverLogID)
    }
    this.log("Booting: Loading Guilds...")
    let guilds = await this.updateGuilds(Client)
    await State.load(guilds)
    this.log(`Booted: Loaded ${guilds.length} Guilds.`)
    this.ready = true
  },

  async onMessage(msg, plugins) {
    if (!this.ready || !msg.member || msg.author.bot) return
    let modID  = State.getConfig(msg.guild.id, 'modID')
    let prefix = State.getConfig(msg.guild.id, 'prefix')
    if (msg.content.indexOf(prefix) !== 0) return

    let opts = msg.content.slice(prefix.length).trim().split(/ +/g)
    let cmd  = opts.shift().toLowerCase()

    if (cmd == 'test' && msg.member.user.id == this.owner) {
      this.ready = false
      if (opts.includes('logging')) {
        this.logJoin(msg.member)
        this.logLeave(msg.member)
      } 
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
  },

  async updateGuilds(Client, guild) {
    let guilds = Client.guilds.keyArray()
    let active = { type: 'LISTENING' }
    let status = `${guilds.length} Servers.`
    Client.user.setActivity(status, active)
    if (guild) {
      let logged = `${guild.name} : ${guild.id}`
      let prefix = guild.deleted ? 'Removed From' : 'Added To'
      if (!guild.deleted) await State.load([ guild.id ])
      this.log(`${prefix} ${logged}`)
    }
    return guilds
  },

  parse(str, member) {
    str = str.split('{user}').join(`<@${member.id}>`)
    str = str.split('{user.id}').join(member.id)
    str = str.split('{user.name}').join(member.user.username)
    return str
  },

  logJoin(member) {
    let data = State.getConfig(member.guild.id, 'onjoin')
    if (data && data.channel) {
      let channel = member.guild.channels.get(data.channel)
      message = this.parse(message, member)
      channel.send(message)
    }
  },

  logLeave(member) {
    let data = State.getConfig(member.guild.id, 'onleave')
    if (data && data.channel) {
      let channel = member.guild.channels.get(data.channel)
      message = this.parse(data.message, member)
      channel.send(message)
    }
  }

}