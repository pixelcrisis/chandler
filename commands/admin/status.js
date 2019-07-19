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
    const result = []

    result.push(`**Prefix: ${config.prefix}**\n`)

    result.push(`**Mods** - ${config.modsID ? `<@&${config.modsID}>` : 'Unset'}`)
    result.push('Set Moderator Role with `{pre}mods [role]`\n')

    result.push(`**Command Warnings** - ${config.warnings}`)
    result.push('Toggle Command Permission Warnings with `{pre}warnings`\n')

    result.push('**User Join**')
    if (config.onjoin && config.onjoin.channel) {
      let channel = config.onjoin.channel
      let message = Bot.escape(config.onjoin.message)
      result.push(`Logging in <#${channel}> with **${message}**`)
    } 
    result.push('Set Logging with `{pre}onjoin [channel] [message]`\n')

    result.push('**User Leave**')
    if (config.onleave && config.onleave.channel) {
      let channel = config.onleave.channel
      let message = Bot.escape(config.onleave.message)
      result.push(`Logging in <#${channel}> with **${message}**`)
    }
    result.push('Set Logging with `{pre}onleave [channel] [message]`\n')

    result.push('**Chandler Permissions**')
    const roles = msg.guild.me.permissions.has('MANAGE_ROLES', false)
    const admin = msg.guild.me.permissions.has('ADMINISTRATOR', false)
    const messages = msg.guild.me.permissions.has('MANAGE_MESSAGES', false)
    const channels = msg.guild.me.permissions.has('MANAGE_CHANNELS', false)
    result.push(`Manage Messages: **${messages}** *(required)*`)
    result.push(`Manage Channels: **${channels}** *(required)*`)
    result.push(`Manage Roles: **${roles}** *(required)*\n`)

    result.push(`Administrator: **${admin}** (recommended)\n`)
    if (!admin) result.push(this.lang.admin)

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