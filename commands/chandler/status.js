module.exports = {

  name: 'status',
  
  level: 5,
  alias: [ 'configs' ],

  help: {
    name: "{pre}status",
    desc: "Reports back the status of the bot.\n\n" +
          "*Permissions Key:*\n" +
          "1,2 - Manage Roles (Global/Channel)\n" +
          "3,4 - Manage Messages (Global/Channel)\n" +
          "5,6 - Manage Channels (Global/Channel)\n" +
          "7 - Admin Perms.\n\n" +
          "*The bot can function pretty well without administrator perms, and just the perms listed. However, this can cause problems with channel specific perms, and some features such as locking or clearing may not work as intended.*"
  },

  fire: function(Bot, msg, opts, lvl) {
    const config = Bot.$getConf(msg)
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
    status.push(`**Permissions**: ${perms} - ${hasAdmin} - \`{pre}help status\``)

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