const exec = require("child_process").exec

module.exports = {

  name: 'exec',
  
  level: 9,

  help: {
    name: "{pre}exec (code)",
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

    if (!opts.length) {
      // just check the deets
      exec('pm2 list', (err, yay, nay) => {
        if (err) return msg.channel.send('Nay```js\n' + clean(nay) + '```')
        yay = yay.split('online')[1].split('px').shift().trim()
        yay = yay.replace(/ +(?= )/g,'').split('│').join(' - ')
        return msg.channel.send('```js\n'+ clean(yay) + '```')
      })
    } else {
      exec(code, (err, yay, nay) => {
        if (err) return msg.channel.send("Nay:\n```js\n" + clean(nay) + "```")
        if (yay.length > 1200) yay = yay.substr(yay.length - 1200, yay.length)
        return msg.channel.send("Yay:\n```js\n" + clean(yay) + "```")
      })
    }
    
  },

  test: async function(Bot, msg) {
    return Bot.reply(msg, "how about no")
  }

}