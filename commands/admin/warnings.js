module.exports = {

  name: 'warnings',
  
  level: 5,

  lang: {
    on: "Enabled Command Permission Warnings.",
    off: "Disabled Command Permission Warnings."
  },

  help: {
    name: "{pre}warning",
    desc: "Toggles the permission warnings for commands."
  },

  fire: function(Bot, msg, opts, lvl) {
    let curr = Bot.getConf(msg.guild.id, 'warnings')
    Bot.setConf(msg.guild.id, 'warnings', !curr)
    return Bot.reply(msg, curr ? this.lang.off : this.lang.on)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}warning",
      desc: "`{pre}warning` - Toggle\n" +
            "`{pre}warning` - Toggle",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, [])

    return Bot.reply(msg, "{pre}warning test complete.")
  }

}