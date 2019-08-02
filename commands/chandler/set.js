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
    desc: "See current values with `{pre}status`\n\n" +
          "`{pre}set prefix ~`\n" +
          "Changes Chandler's prefix in the server.\n\n" +
          "`{pre}set mods @Staff`\n" +
          "Marks a role as moderators.\n\n" +
          "`{pre}set warnings on/off`\n" +
          "Toggles command permission warnings.\n\n" +
          "`{pre}set onjoin #channel {/user} joined.`\n" +
          "set user logging in a channel with an optional message.\n\n" +
          "`{pre}set onleave #channel {/user.name} left.`\n" +
          "set user logging in a channel with an optional message."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)
    const opt = opts.shift().toLowerCase()
    const val = opts.join(' ')

    if (this[`__${opt}`]) return this[`__${opt}`](Bot, msg, val, opt)
    if (opt == 'warning') return this.__warnings(Bot, msg, val)
    return Bot.reply(msg, this.help)
  },

  __prefix: function(Bot, msg, val) {
    Bot.$setConf(msg, 'prefix', val)
    return Bot.reply(msg, this.lang.prefix, val)
  },

  __mods: function(Bot, msg, val) {
    const role = Bot.verifyRole(msg, val)
    if (!role) return Bot.reply(msg, Bot.lang.bad.args, val)
    Bot.$setConf(msg, 'modsID', role.id)
    return Bot.reply(msg, this.lang.modsID, role.id)
  },

  __warnings: function(Bot, msg, val) {
    if (Bot.yes.includes(val.toLowerCase())) {
      Bot.$setConf(msg, 'warnings', true)
      return Bot.reply(msg, this.lang.enabled, 'Command Permission Warnings')
    }
    if (Bot.no.includes(val.toLowerCase())) {
      Bot.$setConf(msg, 'warnings', false)
      return Bot.reply(msg, this.lang.disabled, 'Command Permission Warnings')
    }
  },

  __onjoin: function(Bot, msg, val, opt) {
    const getKey = val.split(' ')
    let key = getKey.shift().toLowerCase()
    let str = getKey.join(' ')
    if (Bot.no.includes(key.toLowerCase())) {
      Bot.$setConf(msg, 'onjoin', false)
      return Bot.reply(msg, this.lang.disabled, 'onjoin')
    }
    const channel = Bot.verifyChannel(msg, key)
    if (!channel) return Bot.reply(msg. Bot.lang.bad.args, key)
    str = str ? str : '{user} joined.'
    Bot.$setConf(msg, 'onjoin', { channel: channel.id, message: str })
    return Bot.reply(msg, this.lang.onjoin, channel.id, Bot.escape(str))
  },

  __onleave: function(Bot, msg, val, opt) {
    const getKey = val.split(' ')
    let key = getKey.shift().toLowerCase()
    let str = getKey.join(' ')
    if (Bot.no.includes(key.toLowerCase())) {
      Bot.$setConf(msg, 'onleave', false)
      return Bot.reply(msg, this.lang.disabled, 'onleave')
    }
    const channel = Bot.verifyChannel(msg, key)
    if (!channel) return Bot.reply(msg. Bot.lang.bad.args, key)
    str = str ? str : '{user.name} left.'
    Bot.$setConf(msg, 'onleave', { channel: channel.id, message: str })
    return Bot.reply(msg, this.lang.onleave, channel.id, Bot.escape(str))
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