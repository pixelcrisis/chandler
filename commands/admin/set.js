module.exports = {

  name: 'set',
  
  level: 5,

  lang: {},

  help: {
    name: "{pre}set [config] [option]",
    desc: "Changes Chandler Settings - {guides}\n\n" +
          "Available Options:\n" +
          "`prefix`, `mods`, `warnings`, `onjoin`, `onleave`\n\n" +
          "Example: `{pre}set prefix !` or `{pre}set mods @Staff`"
  },

  fire: function(Bot, msg, opts, lvl) {

  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}set",
      desc: "`{pre}set` - Help\n" +
            "`{pre}set prefix ~` - Set",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['prefix', '~'])

    return Bot.reply(msg, "{pre}set test complete.")
  }

}