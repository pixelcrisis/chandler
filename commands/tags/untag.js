module.exports = {

  name: 'untag',
  
  level: 3,

  lang: {
    none: "`{val1}` isn't a tag.",
    done: "Removed tag: `{val1}`"
  },

  help: {
    name: "{pre}untag [command]",
    desc: "Removes tag `command`\n" +
          "Use `>tag` to set a tag."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length != 1) return Bot.reply(msg, this.help)

    const tag = Bot.getTag(msg.guild.id, opts[0])
    if (!tag) return Bot.reply(msg, this.lang.none, opts[0])
    Bot.remTag(msg.guild.id, opts[0])
    return Bot.reply(msg, this.lang.done, opts[0])
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}untag",
      desc: "`{pre}untag` - Help\n" +
            "`{pre}untag tester` - Remove/Delete",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['tester'])
    
    return Bot.reply(msg, "{pre}untag test complete.")
  }

}