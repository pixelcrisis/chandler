module.exports = {

  name: 'edit',
  
  level: 3,

  help: {
    name: "{pre}edit [messageID] [content]",
    desc: "Edits message with id `messageID` to `content`.\n" +
          "`content` can be a string or an embed.\n" +
          "You can use an embed generator [like this one](https://leovoel.github.io/embed-visualizer/) to easily make an embed."
  },

  fire: async function(Bot, msg, opts, lvl) {
    if (opts.length < 2) return Bot.reply(msg, this.help)

    const msgID = opts.shift()
    const newMsg = opts.join(' ')
    await msg.channel.fetchMessage(msgID).then(m => {
      // if not an embed, push the edit
      if (newMsg.indexOf('{') !== 0) m.edit(newMsg)
      else {
        let embed = Bot.parseEmbed(newMsg)
        if (embed) m.edit(m.content, embed)
        else return Bot.reply(msg, Bot.lang.badParse)
      }
    }).catch(() => {
      return Bot.reply(msg, Bot.lang.badMsg, msgID)
    })
    return Bot.booted ? msg.delete() : true
  },

  test: async function(Bot, msg, data) {
    Bot.reply(msg, {
      name: "Testing {pre}edit",
      desc: "`{pre}edit` - Help\n" +
            "`{pre}edit bad` - No Message\n" +
            "`{pre}edit string` - String Edit\n" +
            "`{pre}edit embed` - Embed Edit",
      color: 16549991
    })

    await this.fire(Bot, msg, [])
    await this.fire(Bot, msg, ['bad', 'message'])

    await msg.channel.send('_ _').then(async m => {
      await this.fire(Bot, msg, [m.id, 'String Edit'])
    })

    await msg.channel.send('_ _').then(async m => {
      await this.fire(Bot, msg, [m.id, '{ "title": "Embed Edit" }'])
    })
    
    return Bot.reply(msg, "{pre}edit test complete.")
  }

}