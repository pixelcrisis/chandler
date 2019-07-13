module.exports = {

  name: 'embed',
  
  level: 3,

  help: {
    name: "{pre}embed [embed]",
    desc: "Prints an embed.\n" +
          "You can use an embed generator [like this one](https://leovoel.github.io/embed-visualizer/) to easily make an embed."
  },

  fire: function(Bot, msg, opts, lvl) {
    if (!opts.length) return Bot.reply(msg, this.help)
    const embed = Bot.parseEmbed(opts.join(' '))
    if (!embed) Bot.reply(msg, Bot.lang.badParse)
    else msg.channel.send(embed)
    return Bot.booted ? msg.delete() : true
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}embed",
      desc: "`{pre}embed string` - Bad Parse\n" +
            "`{pre}embed embed` - Embed Test",
      color: 16549991
    })

    await this.fire(Bot, msg, ['string'])
    await this.fire(Bot, msg, ['{','"title":','"Embed Test"','}'])
    
    return Bot.reply(msg, "{pre}embed test complete.")
  }

}