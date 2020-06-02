// clear.js - for bulk removing messages

module.exports = {
  gate: 3,
  also: ['clean', 'delete', 'remove', 'rm'],

  help: {
    name: "~/clear (amount)",
    desc: "Delete `amount` messages from the current channel.\n" +
          "Can only remove up to 300 messages at a time.\n" +
          "Messages will be deleted instantly if they can.\n" +
          "{{ ~/clear 24 || ~/clear 300 }}"
  },

  lang: {
    total: "Can only remove 300 messages at a time.",
    clean: "Successfully cleared {val1}/{val2} messages."
  },

  fire: async function (Chandler, Msg) {
    if (Msg.args.length != 1) return Chandler.reply(Msg, this.help)

    // check to see if we can actually delete the messages
    if (!Chandler.canManageMessages(Msg)) {
      return Chandler.reply(Msg, Chandler.EN.delete, Msg.channel.id)
    }

    // delete the trigger
    await Msg.channel.messages.delete(Msg.channel.lastMessageID)

    // make sure our option is a number, and within limits
    const amount = parseInt(Msg.args[0])
    if (isNaN(amount)) return Chandler.reply(Msg, Chandler.EN.number)
    if (amount > 300) return Chandler.reply(Msg, this.lang.total)

    // Use the typing indicator to indicate in progress
    Msg.channel.startTyping()

    // set a flag for when we find old messages
    let old = false
    let amt = amount
    let progress = amount

    while (amt > 0) {
      let wiped = 0
      // only process 100 messages at a time
      let limit = amt > 100 ? 100 : amt
      let batch = await Msg.channel.messages.fetch({ limit })

      // don't try and delete messages that aren't there
      if (batch.size < 1) break

      if (old) {
        for (const message of batch) {
          await message[1].delete()
          amt -= 1
        }
      } else {
        let bulk = await Msg.channel.bulkDelete(batch, true)
        if (bulk.size < batch.size) old = true
        amt -= bulk.size
      }

      progress = amount - amt
      await Chandler.wait(1000)
    }

    // We're done!
    Msg.channel.stopTyping()
    Chandler.replyFlash(Msg, this.lang.clean, progress, amount)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ['102']

    for (var i = 1; i <= 102; i++) {
      await Msg.channel.send(`${i}`)
    }

    await Msg.channel.send('~~clear')

    await this.fire(Chandler, Msg)
  }
}