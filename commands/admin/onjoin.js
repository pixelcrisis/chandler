module.exports = {

  name: 'onjoin',
  
  level: 5,

  lang: {
    none: "No longer logging user joins.",
    done: "Logging User Joins in <#{val1}> with: `{val2}`"
  },

  help: {
    name: "{pre}onjoin [#channel] (message)",
    desc: "Sets an optional welcome/log message for new users.\n" +
          "Example: `{pre}onjoin #welcome Hello, {/user}!`\n" +
          "Use `{pre}onjoin false` to disable feature.\n" +
          "`(message)` defaults to `{/user} joined.`\n\n" +
          "**Available Tags:**\n" +
          "`{/user}` - @User\n" +
          "`{/user.id}` and `{/user.name}` also work."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (opts.length < 1) return Bot.reply(msg, this.help)

    let data = { 
      channel: opts.shift(), 
      message: opts.join(' ')
    }

    if (Bot.no.includes(data.channel)) {
      data.channel = false
      Bot.setConf(msg.guild.id, 'onjoin', data)
      return Bot.reply(msg, this.lang.none)
    }

    data.message = data.message ? data.message : "{user} joined."
    const channel = Bot.verifyChannel(msg, data.channel)
    if (!channel) return Bot.reply(msg, Bot.lang.noChan, data.channel)
    data.channel = channel.id

    Bot.setConf(msg.guild.id, 'onjoin', data)
    const escaped = Bot.escape(data.message)
    return Bot.reply(msg, this.lang.done, data.channel, escaped)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}onjoin",
      desc: "`{pre}onjoin` - Help\n" +
            "`{pre}onjoin bad` - Bad Channel\n" +
            "`{pre}onjoin test` - Set\n" +
            "`{pre}onjoin test message` - Set\n" +
            "`guildMemberAdd() - message\n" +
            "`{pre}onjoin off` - Disabled",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['bad'])
    await this.fire(Bot, msg, [data.channel])
    await this.fire(Bot, msg, [data.channel, '{user} joined with {user.id}'])
    await Bot.emit('guildMemberAdd', msg.member)
    await Bot.sleep(2000)
    await this.fire(Bot, msg, ['off'])

    return Bot.reply(msg, "{pre}onjoin test complete.")
  }

}