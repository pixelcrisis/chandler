// Chandler Reply Functions
// This handles what Chandler says

module.exports = (Bot) => {

  Bot.reply = (msg, data, val1, val2) => {
    if (!Bot.canChat(msg)) return false
    const response = Bot.response(msg, data, val1, val2)
    if (response.length == 1) return msg.channel.send(response[0])
    for (var i = 0; i < response.length; i++) {
      msg.channel.send(response[i])
    }
  }

  Bot.replyFlash = async (msg, data, val1, val2) => {
    const flashed = await Bot.reply(msg, data, val1, val2)
    await Bot.sleep(5000)
    if (flashed) flashed.delete()
  }

  Bot.deleteTrigger = (msg) => {
    if (Bot.canDelete(msg) && Bot.booted && !Bot.chaining) {
      return msg.delete()
    }
  }

  Bot.response = (msg, data, val1, val2) => {
    let result = [], desc = ''
    let embed = { author: {} }

    if (typeof data == 'string') {
      embed.description = Bot.parse(msg, data, val1, val2)
    }

    else {
      for (var prop in data) {
        let it = data[prop]

        if (prop != 'fields') {
          if (Array.isArray(it)) it = it.join('ch&ler')
          if (typeof it == 'string') {
            it = Bot.parse(msg, it, val1, val2)
            if (it.indexOf('ch&ler') > -1) it = it.split('ch&ler')
          }
        }

        if (prop == 'name') embed.author.name = it
        else if (prop == 'desc') embed.description = it
        else embed[prop] = it
      }
    }

    return Bot.splitResponse(embed)
  }

  Bot.splitResponse = (data) => {
    if (!Array.isArray(data.description)) return [ { embed: data } ]
    let str = '', messages = [], result = []
    for (var i = 0; i < data.description.length; i++) {
      if (str) {
        let len = str.length + data.description[i].length + 2
        if (len >= 1850) messages.push(str)
        str = len < 1850 ? `${str}\n${data.description[i]}` : data.description[i]
      }
      else str = data.description[i]
    }
    if (str) messages.push(str)

    for (var i = 0; i < messages.length; i++) {
      let embed = JSON.parse(JSON.stringify(data))
      const footer = { text: `Page ${i + 1}/${messages.length}` }
      embed.description = messages[i]
      if (messages.length > 1) embed.footer = footer
      result.push({ embed })
    }

    return result
  }

  Bot.escape = (data) => data ? data.split('{').join('{/') : data

  Bot.clean = (data) => {
    const inspect = (data) => require('util').inspect(data, { depth: 1 })
    if (typeof data !== 'string') data = inspect(data)
    data = data.split(Bot.token).join('t0k3n-n0t-f0r-s4l3')
    data = data.split(Bot.conf.dbl.auth).join('f@keAuth')
    data = data.split(Bot.conf.dbl.token).join('th1s-0n3-4ls0-n4S')
    return ['```js', data, '```'].join('\n')
  }

  Bot.parse = (msg, data, val1, val2) => {
    if (typeof data != 'string') return data

    data = data.split('{val1}').join(val1)
    data = data.split('{val2}').join(val2)
    data = data.split('{guides}').join(Bot.lang.guides)
    data = data.split('{invite}').join(Bot.lang.invite)
    data = data.split('{docs}').join(Bot.lang.docs)
    data = data.split('{server}').join(Bot.lang.server)
    data = data.split('{vote}').join(Bot.lang.vote)
    data = data.split('{ver}').join(Bot.version)

    if (msg) {
      data = data.split('{love}').join(Bot.gotLove(msg.author.id))
      data = data.split('{user}').join(`<@${msg.author.id}>`)
      data = data.split('{user.id}').join(msg.author.id)
      data = data.split('{user.name}').join(msg.author.username)
      if (msg.guild) {
        const prefix = Bot.confs.get(msg.guild.id, 'prefix')
        data = data.split('{pre}').join(prefix)
      }
    }

    // unescape escaped parse flags
    data = data.split('{/').join('{')
    return data
  }

}