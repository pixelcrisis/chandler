module.exports = {

  name: 'status',
  
  level: 5,
  alias: [ 'configs' ],

  lang: {
    warn: "*(You can't use that command...)*",
    admin: "*The bot can function pretty well without administrator perms, and just the perms listed. However, this can cause problems with channel specific perms, and some features such as locking or clearing may not work as intended.*"
  },

  help: {
    name: "{pre}status",
    desc: "Reports back the status of the bot."
  },

  fire: function(Bot, msg, opts, lvl) {
    const config = Bot.confs.get(msg.guild.id)
    const result = ['_ _'], self = msg.guild.me, chan = msg.channel

    const mods = config.modsID ? `<@&${config.modsID}>` : '`Unset`'
    const warn = `\`${config.warnings}\` ${this.lang.warn}`
    let onjoin = '`false`', onleave = '`false`'

    if (config.onjoin && config.onjoin.channel) {
      let message = Bot.escape(config.onjoin.message)
      onjoin = `<#${config.onjoin.channel}> \`${message}\``
    }

    if (config.onleave && config.onleave.channel) {
      let message = Bot.escape(config.onleave.message)
      onleave = `<#${config.onleave.channel}> \`${message}\``
    }

    result.push('`{pre}config prefix` `{pre}`')
    result.push('`{pre}config mods` ' + mods)
    result.push('`{pre}config warnings` ' + warn)
    result.push('\n`{pre}config onjoin` ' + onjoin)
    result.push('\n`{pre}config onleave` ' + onleave)

    const hasAdmin = self.permissions.has('ADMINISTRATOR', false)
    const hasRoles = self.permissions.has('MANAGE_ROLES', false)
    const hasMsgs  = self.permissions.has('MANAGE_MESSAGES', false)
    const hasChans = self.permissions.has('MANAGE_CHANNELS', false)
    const canRoles = Bot.canRoles(self, chan)
    const canMsgs  = Bot.canDelete(self, chan)
    const canChans = Bot.canChannel(self, chan)
    result.push('\n**Required Permissions** [server/channel]')

    result.push('`Manage Roles` : [`' + hasRoles + '`/`' + canRoles + '`]')
    result.push('`Manage Messages` : [`' + hasChans + '`/`' + canChans + '`]')
    result.push('`Manage Channels` : [`' + hasMsgs + '`/`' + canMsgs + '`]')

    result.push(`\n**Administrator:** \`${hasAdmin}\` (recommended)\n`)
    if (!hasAdmin) result.push(this.lang.admin)

    return Bot.listReply(msg, 'Chandler v{version}', result)
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