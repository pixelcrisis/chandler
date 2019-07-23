module.exports = {

  name: 'set',
  
  level: 5,

  lang: {
    modsID: "Set Mods to <@&{val1}>",
    prefix: "Set Prefix to `{val1}`\nReminder: You can @Chandler as a prefix if something goes sideways."
  },

  help: {
    name: "{pre}set [option] [value]",
    desc: "Changes Chandler Settings - {guides}\n\n" +
          "Available Options:\n" +
          "`prefix`, `mods`, `warnings`, `onjoin`, `onleave`\n\n" +
          "Example: `{pre}set prefix !` or `{pre}set mods @Staff`\n" +
          "See current values with `{pre}status"
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)
    const opt = opts.shift().toLowerCase()
    const val = opts.join(' ')

    if (opt == 'prefix') {
      Bot.setConf(msg.guild.id, 'prefix', val)
      return Bot.reply(msg, this.lang.prefix, val)
    }

    if (opt == 'mods') {
      const role = Bot.verifyRole(msg, val)
      if (!role) return Bot.reply(msg, Bot.lang.badRole, val)
      Bot.setConf(msg.guild.id, 'modsID', role.id)
      return Bot.reply(msg, this.lang.modsID, role.id)
    }
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}set",
      desc: "`{pre}set` - Help\n" +
            "`{pre}set prefix ~` - Set",
            "`{pre}set mods developer` - Set",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['prefix', '~'])
    await this.fire(Bot, msg, ['mods', 'developer'])

    return Bot.reply(msg, "{pre}set test complete.")
  }

}