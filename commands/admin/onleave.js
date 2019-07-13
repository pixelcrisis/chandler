module.exports = {

  name: 'onleave',
  
  level: 5,

  lang: {
    none: "No longer logging user departures.",
    done: "Logging User Departures in <#{val1}> with: `{val2}`"
  },

  help: {
    name: "{pre}onleave [#channel] (message)",
    desc: "Sets an optional leave message for deparing users.\n" +
          "Example: `{pre}onleave #server-logs {/user} Left!`\n" +
          "Use `{pre}onleave false` to disable feature.\n" +
          "`(message)` defaults to `{/user.name} left.`\n\n" +
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
      Bot.setConfig(msg.guild.id, { onleave: data })
      return Bot.reply(msg, this.lang.none)
    }

    data.message = data.message ? data.message : "{user.name} left."
    const channel = Bot.verifyChannel(msg, data.channel)
    if (!channel) return Bot.reply(msg, Bot.lang.badChan, data.channel)
    data.channel = channel.id

    Bot.setConfig(msg.guild.id, { onleave: data })
    const escaped = Bot.escape(data.message)
    return Bot.reply(msg, this.lang.done, data.channel, escaped)
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}onleave",
      desc: "`{pre}onleave` - Help\n" +
            "`{pre}onleave bad` - Bad Channel\n" +
            "`{pre}onleave test` - Set\n" +
            "`{pre}onleave test message` - Set\n" +
            "`guildMemberRemove() - message\n" +
            "`{pre}onleave off` - Disabled",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['bad'])
    await this.fire(Bot, msg, [data.channel])
    await this.fire(Bot, msg, [data.channel, '{user.name} left with {user.id}'])
    await Bot.emit('guildMemberRemove', msg.member)
    await Bot.sleep(2000)
    await this.fire(Bot, msg, ['off'])

    return Bot.reply(msg, "{pre}onleave test complete.")
  }

}