// edit.js - editing messages that the bot sends

module.exports = {
  gate: 3,

  help: {
    name: "~/edit [messageID] [content]",
    desc: "Edits message with id `messageID` to `content`.\n" +
          "`content` can be either text or an embed.\n" +
          "{{ ~/edit 606874363089649684 new message! }}\n" +
          "[Embed Generator]({embeds}) | [Find Message ID]({getids})"
  },

  lang: "I can only edit my own messages, sorry.",

  fire: async function (Chandler, Msg) {
    if (Msg.args.length < 2) return Chandler.reply(Msg, this.help)

    const messageID = Msg.args.shift()
    const message = Msg.args.join(' ')

    // check and see if we're dealing with an embed
    let embed = false
    if (message.indexOf('{') === 0) {
      embed = Chandler.verifyEmbed(message)
      if (!embed) return Chandler.reply(Msg, Chandler.EN.verify, message)
    }

    // attempt to fetch the message
    await Msg.channel.messages.fetch(messageID)
      .then(old => {
        // bow out if it isn't a bot authored message
        if (old.author.id != Chandler.user.id) {
          return Chandler.reply(Msg, this.lang)
        }

        // send a message, or send the embed
        if (!embed) old.edit(message)
        else old.edit(old.content, embed)
      })
      .catch(() => Chandler.reply(Msg, Chandler.EN.verify, messageID))


    return Chandler.deleteTrigger(Msg)
  },

  test: async function (Chandler, Msg, data) {
    Msg.test = true
    // this is used for deleteTrigger
    // if multiple tests are called, it tries
    // to delete the same message
    
    await Msg.channel.send('_ _').then(async test => {

      Msg.args = [test.id, 'String Edit']
      await this.fire(Chandler, Msg)

      await Chandler.wait(3000)

      Msg.args = [test.id, '{', '"title":', '"Embed', 'Edit"', '}']
      await this.fire(Chandler, Msg)

    })
  }
}