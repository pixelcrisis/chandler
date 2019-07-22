// Chandler Reply Functions
// This handles what Chandler says

module.exports = (Bot) => {

  const inspect = require('util').inspect
  const website = '[Website](https://chandler.12px.io)'
  const support = '[Support Server](https://discord.gg/tjRC7E4)'
  const invite = '[Invite Me](https://discordapp.com/api/oauth2/authorize?client_id=596194094275887116&permissions=8&scope=bot)'

  Bot.escape = (data) => data ? data.split('{').join('{/') : data

  Bot.parse = (msg, data, val1, val2) => {
    if (typeof data != 'string') return data

    data = data.split('{val1}').join(val1)
    data = data.split('{val2}').join(val2)
    data = data.split('{invite}').join(invite)
    data = data.split('{website}').join(website)
    data = data.split('{support}').join(support)
    if (msg) {
      if (msg.member) {
        data = data.split('{user}').join(`<@${msg.member.id}>`)
        data = data.split('{user.id}').join(msg.member.id)
        data = data.split('{user.name}').join(msg.member.user.username)
      }
      if (msg.guild) {
        const prefix = Bot.getConf(msg.guild.id, 'prefix')
        data = data.split('{pre}').join(prefix)
      }
    }
    // unescape escaped parse flags
    data = data.split('{/').join('{')
    return data
  }

  Bot.clean = (data) => {
    if (typeof data !== 'string') data = inspect(data, { depth: 1 })
    data = data.split(Bot.token).join('t0k3n-n0t-f0r-s4l3')
    data = data.split(Bot.conf.dbl.auth).join('f@keAuth')
    data = data.split(Bot.conf.dbl.token).join('th1s-0n3-4ls0-n4S')
    return ['```js', data, '```'].join('\n')
  }

  Bot.reply = (msg, data, val1, val2) => {
    let embed = { author: {} }
    if (typeof data == 'string') {
      embed.description = Bot.parse(msg, data, val1, val2)
    } else {
      for (var prop in data) {
        if (prop != 'fields') {
          data[prop] = Bot.parse(msg, data[prop], val1, val2)
        }
        if (prop == 'name') embed.author.name = data[prop]
        else if (prop == 'desc') embed.description = data[prop]
        else embed[prop] = data[prop]
      }
    }
    return msg.channel.send({ embed })
  }

  Bot.flashReply = async (msg, data, val1, val2) => {
    const flashed = await Bot.reply(msg, data, val1, val2)
    await Bot.sleep(5000)
    flashed.delete()
  }

  Bot.listReply = (msg, title, data, join = '\n') => {
    // due to discord text limits
    // if we're sending array data
    // split it at the 2k limit
    let text = '', messages = []
    for (var i = 0; i < data.length; i++) {
      let message = Bot.parse(msg, data[i])
      if (!text) text = message
      else {
        let len = text.length + message.length + join.length
        if (len >= 1850) messages.push(text)
        text = len < 1850 ? `${text}${join}${message}` : `${message}`        
      }
    }
    if (text) messages.push(text)
    // now we have an array of messages plit at 2k characters
    // now we print them one by one
    for (var i = 0; i < messages.length; i++) {
      let footer = `Page ${i + 1}/${messages.length}`
      let embed = {
        description: messages[i],
        author: { name: Bot.parse(msg, title) },
        footer: { text: messages.length > 1 ? footer : '' }
      }
      return msg.channel.send({ embed })
    }
  }

}