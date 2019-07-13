module.exports = {

  name: 'mods',
  
  level: 5,
  alias: ['staff'],

  resp: {
    set: "Mods set to: <@&{val1}>",
    current: "Mods are currently set as: <@&{val1}>",
    none: "Mods haven't been set yet.",
    badRole: "`{val1}` didn't seem like a role to me."
  },

  help: {
    name: "{pre}mods (role)",
    desc: "Recognize this `role` as Moderator\n" +
          "If no `role`, returns current Mod role."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) {
      const mods = Bot.getConfig(msg.guild.id, 'modsID')
      if (mods) return Bot.reply(msg, this.resp.current, mods)
      else return Bot.reply(msg, this.resp.none)
    }

    else if (opts.length == 1) {
      const role = Bot.verifyRole(msg, opts[0])
      if (!role) return Bot.reply(msg, this.resp.badRole, opts[0])
      Bot.setConfig(msg.guild.id, { modsID: role.id })
      return Bot.reply(msg, this.resp.set, role.id)
    }

    else return Bot.reply(msg, this.help)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}mods",
      desc: "`{pre}mods` - Current\n" +
            "`{pre}mods bad` - Bad Role\n" +
            "`{pre}mods role` - Set",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['bad'])
    await this.fire(Bot, msg, [data.role])
    
    return Bot.reply(msg, "{pre}mods test complete.")
  }

}