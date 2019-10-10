module.exports = {
  
  name: 'config',
  level: 5,
  alias: ['status', 'set', 'configs'],

  help: {
    name: "{pre}config (option) (value)",
    desc: "If no options or value is provided, returns the current configs.\n\n" +
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

  lang: {
    modsID:   "Set Mods to <@&{val1}>",
    onjoin:   "Logging User Joins in <#{val1}> with `{val2}`",
    onleave:  "Logging User Left in <#{val1}> with `{val2}`",
    enabled:  "Enabled {val1}",
    disabled: "Disabled {val1}",
    prefix:   "Set Prefix to `{val1}`\nReminder: You can {bot} as a prefix if something goes sideways."
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return this.status(Bot, evt)

    let opt = evt.options.shift()
    let val = evt.options.join(' ')

    if (!val) return Bot.reply(evt, Bot.EN.bad.val)
    if (this[`__${opt}`]) return this[`__${opt}`](Bot, evt, val)
  },

  __prefix: function (Bot, evt, val) {
    Bot.$setConf(evt, 'prefix', val)
    return Bot.reply(evt, this.lang.prefix, val)
  },

  __mods: function (Bot, evt, val) {
    const role = Bot.verifyRole(evt, val)
    if (!role) return Bot.reply(Bot.EN.bad.arg, val)
    Bot.$setConf(evt, 'modsID', role.id)
  },

  __warnings: function (Bot, evt, val) {
    Bot.$setConf(evt, 'warnings', Bot.isY(val))
    const msg = Bot.isY(val) ? this.lang.enabled : this.lang.disabled
    return Bot.reply(evt, msg, 'Command Permission Warnings')
  },

  __onjoin: function (Bot, evt, val) {
    let byKey = val.split(' ')
    const key = byKey.shift().toLowerCase()
    const str = byKey.join(' ')

    if (Bot.isN(key)) {
      Bot.$setConf(evt, 'onjoin', false)
      return Bot.reply(evt, this.lang.disabled, 'onjoin')
    }

    const chan = Bot.verifyChannel(evt, key)
    if (!chan) return Bot.reply(evt, Bot.EN.bad.arg, key)
    const message = str || '{user.name} left.'
    Bot.$setConf(evt, 'onjoin', { channel: chan.id, message })
    return Bot.reply(evt, this.lang.onjoin, chan.id, Bot.escape(message))
  },

  __onleave: function (Bot, evt, val) {
    let byKey = val.split(' ')
    const key = byKey.shift().toLowerCase()
    const str = byKey.join(' ')

    if (Bot.isN(key)) {
      Bot.$setConf(evt, 'onleave', false)
      return Bot.reply(evt, this.lang.disabled, 'onleave')
    }

    const chan = Bot.verifyChannel(evt, key)
    if (!chan) return Bot.reply(evt, Bot.EN.bad.arg, key)
    const message = str || '{user.name} left.'
    Bot.$setConf(evt, 'onleave', { channel: chan.id, message })
    return Bot.reply(evt, this.lang.onleave, chan.id, Bot.escape(message))
  },

  status: function (Bot, evt) {
    const cfg = evt.config, self = evt.guild.me, chan = evt.channel
    const response = { name: `${evt.guild.name} Config`, desc: [] }

    const mods = cfg.modsID ? `<@&${cfg.modsID}>` : '`Unset`'
    let onjoin = '`false`', onleave = '`false`'

    if (cfg.onjoin && cfg.onjoin.channel) {
      onjoin = `<#${cfg.onjoin.channel}> \`${Bot.escape(cfg.onjoin.message)}\``
    }
    if (cfg.onleave && cfg.onleave.channel) {
      onleave = `<#${cfg.onleave.channel}> \`${Bot.escape(cfg.onleave.message)}\``
    }

    const hasAdmin = self.permissions.has('ADMINISTRATOR', false) ? '✓' : '✗'
    const hasRoles = self.permissions.has('MANAGE_ROLES', false) ? '✓' : '✗'
    const hasChans = self.permissions.has('MANAGE_CHANNELS', false) ? '✓' : '✗'
    const hasMsgs  = self.permissions.has('MANAGE_MESSAGES', false) ? '✓' : '✗'
    const canRoles = Bot.canRoles(self, chan) ? '✓' : '✗'
    const canChans = Bot.canDelete(self, chan) ? '✓' : '✗'
    const canMsgs  = Bot.canChannel(self, chan) ? '✓' : '✗'

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

  test: async function (Bot, evt, data) {
    evt.options = []
    await this.fire(Bot, evt)

    evt.options = ['prefix', '~']
    await this.fire(Bot, evt)

    evt.options = ['mods', 'developer']
    await this.fire(Bot, evt)

    evt.options = ['warnings', 'off']
    await this.fire(Bot, evt)

    evt.options = ['onjoin', this.data.chan, '{user} joined {user.id}']
    await this.fire(Bot, evt)
    await Bot.emit('guildMemberAdd', evt.member)
    await Bot.wait(2000)

    evt.options = ['onjoin', 'off']
    await this.fire(Bot, evt)

    evt.options = ['onleave', this.data.chan, '{user.id} left {user.id}']
    await this.fire(Bot, evt)
    await Bot.emit('guildMemberRemove', evt.member)
    await Bot.wait(2000)

    evt.options = ['onleave', 'off']
    await this.fire(Bot, evt)
  }

}