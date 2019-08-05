// Chandler Reply Functions
// This handles what Chandler says

module.exports = (Bot) => {

  Bot.reply = (evt, data, val1, val2) => {
    if (!Bot.canChat(evt)) return false
    const response = Bot.response(evt, data, val1, val2)
    const finalMsg = response.length - 1
    for (let i = 0; i < response.length; i++) {
      if (i == finalMsg) return evt.channel.send(response[i])
      else evt.channel.send(response[i])
    }
  }

  Bot.replyFlash = async (evt, data, val1, val2) => {
    const flashed = await Bot.reply(evt, data, val1, val2)
    await Bot.sleep(5000)
    if (flashed && flashed.delete) flashed.delete()
  }

  Bot.deleteTrigger = (msg) => {
    const canProcess = (Bot.booted && !Bot.chaining)
    if (canProcess && Bot.canDelete(msg)) return msg.delete()
  }

  Bot.response = (evt, data, val1, val2) => {
    let result = [], desc = ''
    let embed = { author: {}, footer: {} }

    if (typeof data != 'string') {
      for (const prop in data) {
        let it = data[prop]

        if (prop != 'fields') {
          if (Array.isArray(it)) it = it.join('ch&ler')
          if (typeof it == 'string') {
            it = Bot.parse(evt, it, val1, val2)
            if (it.indexOf('ch&ler') > -1) it = it.split('ch&ler')
          }
        }

        if (prop == 'name') embed.author.name = it
        if (prop == 'icon') embed.author.icon_url = it
        if (prop == 'foot') embed.footer.text = it
        else if (prop == 'desc') embed.description = it
        else embed[prop] = it
      }
    } else embed.description = Bot.parse(evt, data, val1, val2)

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

  Bot.parse = (evt, data, val1, val2) => {
    if (typeof data != 'string') return data

    data = data.split('{val1}').join(val1)
    data = data.split('{val2}').join(val2)
    data = data.split('{guides}').join(Bot.lang.url.help)
    data = data.split('{invite}').join(Bot.lang.url.invite)
    data = data.split('{docs}').join(Bot.lang.url.docs)
    data = data.split('{server}').join(Bot.lang.url.guild)
    data = data.split('{vote}').join(Bot.lang.url.vote)
    data = data.split('{timezones}').join(Bot.lang.url.zones)
    data = data.split('{ver}').join(Bot.version)
    data = data.split('{guilds}').join(Bot.guilds.keyArray().length)

    if (evt) {
      if (evt.author) {
        data = data.split('{love}').join(Bot.gotLove(evt.author.id))
        data = data.split('{user}').join(`<@${evt.author.id}>`)
        data = data.split('{user.id}').join(evt.author.id)
        data = data.split('{user.name}').join(evt.author.username)
      }

      if (evt.guild) {
        const prefix = Bot.$getConf(evt, 'prefix')
        data = data.split('{pre}').join(prefix)
        data = data.split('{guild.name}').join(evt.guild.name)
        data = data.split('{guild.id}').join(evt.guild.id)
        data = data.split('{guild.count}').join(evt.guild.memberCount)
        data = data.split('{guild.owner}').join(evt.guild.owner.user.username)
      }
    }

    data = data.split('{/').join('{')
    return data
  }

}