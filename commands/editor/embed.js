module.exports = {
  
  name: 'embed',
  level: 3,

  help: {
    name: "{pre}embed [embed]",
    desc: "Prints an embed.\n" +
          "You can use an embed generator [like this one]({embeds}) to easily make an embed."
  },

  fire: async function (Bot, evt) {
    if (!evt.options.length) return Bot.reply(evt, this.help)
    const embed = Bot.parseEmbed(evt.options.join(' '))
    if (embed) evt.channel.send(embed)
    else Bot.reply(evt, Bot.EN.bad.embed)
    return Bot.deleteTrigger(evt)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['string']
    await this.fire(Bot, evt)

    evt.options = ['{', '"title":', '"Embed Test"', '}']
    await this.fire(Bot, evt)
  }

}