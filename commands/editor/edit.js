module.exports = {
  
  name: 'edit',
  level: 3,

  help: {
    name: "{pre}edit (channel) [messageID] [content]",
    desc: "Edits message (with id `messageID`) to `content`\n" +
          "`channel` is optional, defaults to current channel.\n" +
          "`content` can be either text or an embed.\n" +
          "You can use an embed generator [like this one]({embeds}) to easily make an embed."
  },

  lang: {
    author: "I can only edit my own messages, sorry."
  },

  fire: async function (Bot, evt) {
    if (evt.options.length < 2) return Bot.reply(evt, this.help)

    const id = evt.options.shift()

    const hasChan = Bot.verifyChannel(evt, id)
    const channel = hasChan || evt.channel

    const mID = hasChan ? evt.options.shift() : id
    const msg = evt.options.join(' ')
    let embed = false

    if (msg.indexOf('{') === 0) {
      embed = Bot.parseEmbed(msg)
      if (!embed) return Bot.reply(evt, Bot.EN.bad.embed)
    }

    await channel.fetchMessage(mID).then(old => {
      if (old.author.id == Bot.user.id) {
        
        if (!embed) old.edit(msg)
        else old.edit(old.content, embed)

      } else return Bot.reply(evt, this.lang.author)
    }).catch(() => Bot.reply(evt, Bot.EN.bad.arg, mID))

    return Bot.deleteTrigger(evt)
  },

  test: async function (Bot, evt, data) {
    evt.options = ['string']
    await this.fire(Bot, evt)

    await evt.channel.send('_ _').then(async msg => {
      evt.options = [msg.id, 'String Edit']
      await this.fire(Bot, evt)
      await Bot.wait(2000)
      evt.options = [msg.id, '{ "title": "Embed Edit" }']
      await this.fire(Bot, evt)
    })
  }

}