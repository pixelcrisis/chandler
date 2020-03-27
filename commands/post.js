// post.js - for posting bulletins (embeds)

module.exports = {
  gate: 3,
  also: ['embed'],

  help: {
    name: "~/post [embed]",
    desc: "Prints an embed (bulletins?!) in the channel.\n" +
          "You can use an embed generator [like this one]({embeds}) " +
          "to easily make your own embed/bulletin!\n" +
          "{{ ~/post { 'title': 'message!' } }}"
  },

  fire: async function (Chandler, Msg) {
    if (!Msg.args.length) return Chandler.reply(Msg, this.help)

    // check and make sure what we got is valid
    const embed = Chandler.verifyEmbed(Msg.args.join(' '))

    if (embed) Msg.channel.send(embed)
    else Chandler.reply(Msg, Chandler.EN.verify, Msg.args.join(' '))

    return Chandler.deleteTrigger(Msg)
  },

  test: async function (Chandler, Msg, data) {
    Msg.test = true
    // this is used for deleteTrigger
    // if multiple tests are called, it tries
    // to delete the same message

    Msg.args = ["string"]
    await this.fire(Chandler, Msg)

    Msg.args = ["{", `"title":`, `"Embed Test"`, "}"]
    await this.fire(Chandler, Msg)
  }
}