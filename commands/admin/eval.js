module.exports = {

  name: 'eval',
  
  level: 9,

  help: {
    name: "{pre}eval (code)",
    desc: "If you don't know what this does..."
  },

  fire: async function(Bot, msg, opts, lvl) {
    const code = opts.join(' ')

    try {
      const ran = await eval(code)
      msg.channel.send(`Yay\n${Bot.clean(ran)}`)
    } catch (err) {
      msg.channel.send(`Nay\n${Bot.clean(err)}`)
    }
    
  },

  test: async function(Bot, msg) {
    return Bot.reply(msg, "how about no")
  }

}