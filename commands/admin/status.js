module.exports = {

  name: 'status',
  
  level: 5,
  alias: [ 'setup', 'config', 'configs' ],

  lang: {
    admin: "*The bot can function pretty well without administrator perms, and just the perms listed. However, this can cause problems with channel specific perms, and some features such as locking or clearing may not work as intended.*"
  },

  help: {
    name: "{pre}status",
    desc: "Reports back the status of the bot."
  },

  fire: function(Bot, msg, opts, lvl) {
    const config = Bot.getConf(msg.guild.id)
    const result = [], self = msg.guild.me, chan = msg.channel

    result.push("Use `{pre}help command` for deatils.\n")

    result.push('`{pre}prefix` : `' + config.prefix + '`')

    let mods = config.modsID ? `<@&${config.modsID}>` : '`Unset`'
    result.push('`{pre}mods` : ' + mods)

    let warn = "` - *(You can't use that command...)*"
    result.push('`{pre}warnings` : `' + config.warnings + warn)

    let onjoin = '\n`{pre}onjoin` : '
    if (config.onjoin && config.onjoin.channel) {
      let message = Bot.escape(config.onjoin.message)
      onjoin += `in <#${config.onjoin.channel}> with \`${message}\``
    } else onjoin += '`Unset`'
    result.push(onjoin)

    let onleave = '\n`{pre}onleave` : '
    if (config.onleave && config.onleave.channel) {
      let message = Bot.escape(config.onleave.message)
      onleave += `in <#${config.onleave.channel}> with \`${message}\`\n`
    } else onleave += '`Unset`\n'
    result.push(onleave)

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

    return Bot.listReply(msg, "Chandler Status", result)
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