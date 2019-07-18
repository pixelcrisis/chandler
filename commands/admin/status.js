module.exports = {

  name: 'status',
  
  level: 5,
  alias: [ 'setup', 'config', 'configs' ],

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

    result.push(`**Permission Warnings** - ${config.warnings}`)
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