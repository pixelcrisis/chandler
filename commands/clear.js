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
    clean: "Successfully cleared {val1} messages."
  },

  fire: async function (Chandler, Msg) {
    if (Msg.args.length != 1) return Chandler.reply(Msg, this.help)

    // check to see if we can actually delete the messages
    if (!Chandler.canManageMessages(Msg)) {
      return Chandler.reply(Msg, Chandler.EN.delete, Msg.channel.id)
    }

    // make sure our option is a number, and within limits
    const amount = parseInt(Msg.args[0])
    if (isNaN(amount)) return Chandler.reply(Msg, Chandler.EN.number)
    if (amount > 300) return Chandler.reply(Msg, this.lang.total)

    // figure out how many batches to run
    const batches = Math.floor(amount / 100)
    // figure out what's leftover after batches
    const remains = amount - (batches * 100)

    let progress = 0
    for (var i = batches; i >= 0; i--) {
      // set limit to 100
      // or leftover if last loop
      let limit = i == 0 ? remains : 100

      // only run if we're actually getting messages
      if (limit) {
        const batch = await Msg.channel.messages.fetch({ limit })

        // print our status update to keep folks informed
        let update = `Removed ${progress}/${amount} Messages...`
        const status = await Chandler.reply(Msg, update)

        // attempt a bulk delete, if messages are old, it fails
        try {
          await Msg.channel.bulkDelete(batch)
          // if we made it here, bulk delete worked
          progress += limit
          console.log('Post Bulk Status Delete')
          await Chandler.deleteMessage(status)
        }
        catch(e) {
          // bulk delete didn't work, we gotta go through manually
          for (const message of batch) {
            progress += 1
            console.log('Spammy Log: In The Loop')
            await Chandler.deleteMessage(message[1])
            await status.edit(`Removed ${progress}/${amount} Messages...`)
          }
          console.log('Post Loop Status Delete')
          await Chandler.deleteMessage(status)
        }
      }
    }

    // delete one more message (the trigger command)
    const last = await Msg.channel.messages.fetch({ limit: 1 })
    console.log('Trigger Delete')
    for (const message of last) await Chandler.deleteMessage(message[1])

    Chandler.replyFlash(Msg, this.lang.clean, amount)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ['300']

    for (var i = 1; i <= 100; i++) {
      await Msg.channel.send(`${i}`)
    }

    await Chandler.wait(15000)

    for (var i = 101; i <= 200; i++) {
      await Msg.channel.send(`${i}`)
    }

    await Chandler.wait(15000)

    for (var i = 201; i <= 300; i++) {
      await Msg.channel.send(`${i}`)
    }

    await this.fire(Chandler, Msg)
  }
}