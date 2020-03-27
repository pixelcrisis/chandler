// say.js - for sending messages as the bot

module.exports = {
  gate: 3,
  also: ['print'],

  help: {
    name: "~/say [message]",
    desc: "Prints `message` in the current channel.\n" +
          "{{ ~/say hello world! }}"
  },

  fire: async function (Chandler, Msg) {
    if (!Msg.args.length) return Chandler.reply(Msg, this.help)

    Msg.channel.send(Msg.args.join(' '))

    return Chandler.deleteTrigger(Msg)
  },

  test: async function (Chandler, Msg, data) {
    Msg.args = ["print", "arg", "~"]
    await this.fire(Chandler, Msg)
  }
}