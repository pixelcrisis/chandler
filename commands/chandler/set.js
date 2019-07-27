module.exports = {

  name: 'set',
  alias: [ 'config' ],
  
  level: 5,

  lang: {
    prefix: "Set Prefix to `{val1}`\nReminder: You can @Chandler as a prefix if something goes sideways.",
    modsID: "Set Mods to <@&{val1}>",
    onjoin: "Logging User Joins in <#{val1}> with `{val2}`",
    onleave: "Logging User Left in <#{val1}> with `{val2}`",
    enabled: "Disabled {val1}",
    disabled: "Disabled {val1}"
  },

  help: {
    name: "{pre}set [option] [value]",
    desc: "*Available Options:*\n\n" +
          "**prefix** - Changes Chandler's prefix in the server.\n" +
          "`{pre}set prefix ~`\n\n" +
          "**mods** - Marks a role as moderators.\n" +
          "`{pre}set mods @Staff`\n\n" +
          "**warnings** - Toggles command permission warnings.\n" +
          "`{pre}set warnings on/off`\n\n" +
          "**onjoin** - set user logging in a channel with an optional message.\n" +
          "`{pre}set onjoin #channel {/user} joined.`\n\n" +
          "**onleave** - set user logging in a channel with an optional message.\n" +
          "`{pre}set onleave #channel {/user.name} left.`\n\n" +
          "See current values with `{pre}status`"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)
    const opt = opts.shift().toLowerCase()
    const val = opts.join(' ')

    const guild = msg.guild.id

    if (opt == 'prefix') {
      Bot.confs.set(guild, val, 'prefix')
      return Bot.reply(msg, this.lang.prefix, val)
    }

    if (opt == 'mods') {
      const role = Bot.verifyRole(msg, val)
      if (!role) return Bot.reply(msg, Bot.lang.badRole, val)
      Bot.confs.set(guild, role.id, 'modsID')
      return Bot.reply(msg, this.lang.modsID, role.id)
    }

    if (opt == 'warnings' || opts == 'warning') {
      if (Bot.yes.includes(val.toLowerCase())) {
        Bot.confs.set(guild, true, 'warnings')
        return Bot.reply(msg, this.lang.enabled, 'Command Permission Warnings')
      }
      if (Bot.no.includes(val.toLowerCase())) {
        Bot.confs.set(guild, false, 'warnings')
        return Bot.reply(msg, this.lang.disabled, 'Command Permission Warnings')
      }
    }

    const getKey = val.split(' ')
    let key = getKey.shift().toLowerCase()
    let str = getKey.join(' ')

    if (opt == 'onjoin') {
      if (Bot.no.includes(key.toLowerCase())) {
        Bot.confs.set(guild, false, 'onjoin')
        return Bot.reply(msg, this.lang.disabled, 'onjoin')
      }
      const channel = Bot.verifyChannel(msg, key)
      if (!channel) return Bot.reply(msg. Bot.lang.badChan, key)
      str = str ? str : '{user} joined.'
      Bot.confs.set(guild, { channel: channel.id, message: str }, 'onjoin')
      return Bot.reply(msg, this.lang.onjoin, channel.id, Bot.escape(str))
    }

    if (opt == 'onleave') {
      if (Bot.no.includes(key.toLowerCase())) {
        Bot.confs.set(guild, false, 'onleave')
        return Bot.reply(msg, this.lang.disabled, 'onleave')
      }
      const channel = Bot.verifyChannel(msg, key)
      if (!channel) return Bot.reply(msg. Bot.lang.badChan, key)
      str = str ? str : '{user.name} left.'
      Bot.confs.set(guild, { channel: channel.id, message: str }, 'onleave')
      return Bot.reply(msg, this.lang.onleave, channel.id, Bot.escape(str))
    }

    return Bot.reply(msg, this.help)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}set",
      desc: "`{pre}set` - Help\n" +
            "`{pre}set prefix ~` - Set\n" +
            "`{pre}set mods developer` - Set\n" +
            "`{pre}set warnings off` - Set\n" +
            "`{pre}set onjoin test` - Set\n" +
            "`{pre}set onjoin test message` - Set\n" +
            "`guildMemberAdd() - message\n" +
            "`{pre}set onjoin off` - Disabled\n" +
            "`{pre}set onleave test` - Set\n" +
            "`guildMemberDelete() - message\n" +
            "`{pre}set onleave off` - Disabled",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['prefix', '~'])
    await this.fire(Bot, msg, ['mods', 'developer'])
    await this.fire(Bot, msg, ['warnings', 'off'])
    await this.fire(Bot, msg, ['onjoin', data.channel])
    await this.fire(Bot, msg, ['onjoin', data.channel, '{user} joined {user.id}'])
    await Bot.emit('guildMemberAdd', msg.member)
    await Bot.sleep(2000)
    await this.fire(Bot, msg, ['onjoin', 'off'])
    await this.fire(Bot, msg, ['onleave', data.channel])
    await Bot.emit('guildMemberRemove', msg.member)
    await Bot.sleep(2000)
    await this.fire(Bot, msg, ['onleave', 'off'])

    return Bot.reply(msg, "{pre}set test complete.")
  }

}