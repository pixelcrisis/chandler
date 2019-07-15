module.exports = {

  name: 'eval',
  
  level: 9,

  help: {
    name: "{pre}eval (code)",
    desc: "If you don't know what this does..."
  },

  fire: async function(Bot, msg, opts, lvl) {
    const code = opts.join(' ')

    const clean = (data) => {
      if (typeof data !== 'string') {
        data = require('util').inspect(data, { depth: 1 })
      }
      return data.split(Bot.token).join('t0k3n')
    }

    try {
      const ran = await eval(code)
      msg.channel.send("Yay:\n```js\n" + clean(ran) + "```")
    } catch (err) {
      msg.channel.send("Nay:\n```js\n" + clean(err) + "```")
    }
    
  },

  test: async function(Bot, msg) {
    return Bot.reply(msg, "how about no")
  }

}