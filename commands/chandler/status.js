module.exports = {

  name: 'status',
  
  level: 5,
  alias: [ 'configs' ],

  lang: {
    admin: "*The bot can function pretty well without administrator perms, and just the perms listed. However, this can cause problems with channel specific perms, and some features such as locking or clearing may not work as intended.*"
  },

  help: {
    name: "{pre}status",
    desc: "Reports back the status of the bot."
  },

  fire: function(Bot, msg, opts, lvl) {
    const config = Bot.confs.get(msg.guild.id)
    const self = msg.guild.me, chan = msg.channel
    const response = { name: `${msg.guild.name} Status`, desc: [] }

    const mods = config.modsID ? `<@&${config.modsID}>` : '`Unset`'
    let onjoin = '`false`', onleave = '`false`'

    if (config.onjoin && config.onjoin.channel) {
      let message = Bot.escape(config.onjoin.message)
      onjoin = `<#${config.onjoin.channel}> \`${message}\``
    }

    if (config.onleave && config.onleave.channel) {
      let message = Bot.escape(config.onleave.message)
      onleave = `<#${config.onleave.channel}> \`${message}\``
    }

    const hasAdmin = self.permissions.has('ADMINISTRATOR', false) ? '✓' : '✗'
    const hasRoles = self.permissions.has('MANAGE_ROLES', false) ? '✓' : '✗'
    const hasMsgs  = self.permissions.has('MANAGE_MESSAGES', false) ? '✓' : '✗'
    const hasChans = self.permissions.has('MANAGE_CHANNELS', false) ? '✓' : '✗'
    const canRoles = Bot.canRoles(self, chan) ? '✓' : '✗'
    const canMsgs  = Bot.canDelete(self, chan) ? '✓' : '✗'
    const canChans = Bot.canChannel(self, chan) ? '✓' : '✗'

    const perms = `${hasRoles}${canRoles}${hasChans}${canChans}${hasMsgs}${canMsgs}`

    let status = response.desc
    status.push("Change values with **set**. Use `{pre}help set` for more info.\n")
    status.push("**mods**: " + mods)
    status.push("**warnings**: `" + config.warnings + "`")
    status.push("**onjoin**: `" + onjoin + "`")
    status.push("**onleave**: `" + onleave + "`\n")
    status.push(`**Permissions**: ${perms} - ${hasAdmin} - [Wat?](${Bot.lang.guides})`)

    Bot.reply(msg, response)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}status",
      desc: "`{pre}status` - Status",
      color: 16549991
    })

    await this.fire(Bot, msg, [])

    return Bot.reply(msg, "{pre}status test complete.")
  }

}