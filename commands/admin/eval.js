module.exports = {

  name: 'eval',
  
  level: 9,

  help: {
    name: "{pre}eval (code)",
    desc: "If you don't know what this does..."
  },

  fire: async function(Bot, msg, opts, access) {
    try {
      const ran = await eval(opts.join(' '))
      msg.channel.send(Bot.clean(ran))
    }
    catch (err) {
      msg.channel.send(Bot.clean(err))
    }
  },

  test: async function(Bot, msg) {
    return Bot.reply(msg, "No Tests.")
  }

}