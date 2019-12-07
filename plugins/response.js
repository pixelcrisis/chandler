// response.js
// for responding 

module.exports = Bot => {

  Bot.reply = (evt, data, val1, val2) => {
    if (!Bot.canChat(evt)) return false
    if (!Array.isArray(data)) data = Bot.response(evt, data, val1, val2)
    const finalMsg = data.length - 1
    for (let i = 0; i < data.length; i++) {
      if (i == finalMsg) return evt.channel.send(data[i])
      else evt.channel.send(data[i])
    }
  }

  Bot.replyFlash = async (evt, data, val1, val2) => {
    const flashed = await Bot.reply(evt, data, val1, val2)
    await Bot.wait(2000)
    if (Bot.canDelete(flashed)) flashed.delete()
  }

  Bot.response = (evt, data, val1, val2) => {
    let embed = { author: {}, footer: {} }

    if (typeof data == 'string') {
      embed.description = Bot.parse(evt, data, val1, val2)
    }

    else for (const prop in data) {
      let it = data[prop]

      if (prop != 'fields') {
        if (Array.isArray(it)) it = it.join('chan_dler')
        if (typeof it == 'string') {
          it = Bot.parse(evt, it, val1, val2)
          if (it.indexOf('chan_dler') > -1) it = it.split('chan_dler')
        }
      }

      if      (prop == 'name') embed.author.name = it
      else if (prop == 'icon') embed.author.icon_url = it
      else if (prop == 'foot') embed.footer.text = it
      else if (prop == 'time') embed.timestamp = it
      else if (prop == 'desc') embed.description = it
      else embed[prop] = it
    }

    return Bot.splitResponse(embed)
  }

  Bot.splitResponse = embed => {
    if (!Array.isArray(embed.description)) return [{ embed }]
    let result = [], messages = [], str = ''
    let data = embed.description

    for (let i = 0; i < data.length; i++) {
      if (!str) str = data[i]
      else {
        let len = str.length + data[i].length + 2
        if (len >= 1850) messages.push(str)
        str = len < 1850 ? `${str}\n${data[i]}` : data[i]
      }
    }
    if (str) messages.push(str)

    for (let i = 0; i < messages.length; i++) {
      let page = JSON.parse(JSON.stringify(embed))
      let foot = { text: `Page ${i + 1}/${messages.length}` }
      if (messages.length > 1) page.footer = foot
      page.description = messages[i]
      result.push({ embed: page })
    }

    return result
  }

  Bot.escape = str => str ? str.split('{').join('{/') : str

  Bot.deleteTrigger = evt => {
    return Bot.canDelete(evt) && !evt.chained ? evt.delete() : false
  }

  Bot.clean = data => {
    const inspect = data => require('util').inspect(data, { depth: 2 })
    if (typeof data !== 'string') data = inspect(data)

    data = data.split(Bot.token).join('t0k3n-n0t-f0r-s4l3')
    if (Bot.conf.dbl.use) {
      data = data.split(Bot.conf.dbl.auth).join('f@keAuth')
      data = data.split(Bot.conf.dbl.token).join('th1s-0n3-4ls0-n4S')
    }
    return ['```js', data, '```'].join('\n')
  }

  Bot.parseEmbed = str => {
    try {
      let obj = JSON.parse(str)
      return obj.embed ? obj : { embed: obj }
    }
    catch(e) { return false }
  }

  Bot.parse = (evt, str, val1, val2) => {
    if (typeof str != 'string') return str

    str = str.split('{{').join('\n\n```js\n')
    str = str.split('}}').join('\n```')
    str = str.split('{val1}').join(val1)
    str = str.split('{val2}').join(val2)
    str = str.split('{bot}').join(`<@${Bot.user.id}>`)
    str = str.split('{guides}').join(Bot.URL.help)
    str = str.split('{invite}').join(Bot.URL.invite)
    str = str.split('{docs}').join(Bot.URL.docs)
    str = str.split('{server}').join(Bot.URL.guild)
    str = str.split('{vote}').join(Bot.URL.vote)
    str = str.split('{timezones}').join(Bot.URL.zones)
    str = str.split('{embeds}').join(Bot.URL.embed)
    str = str.split('{ver}').join(Bot.vers)
    str = str.split('{guilds}').join(Bot.guilds.keyArray().length)

    if (evt) {
      if (evt.author) {
        str = str.split('{love}').join(Bot.hasLove(evt.author.id))
        str = str.split('{user}').join(`<@${evt.author.id}>`)
        str = str.split('{user.id}').join(evt.author.id)
        str = str.split('{user.name}').join(evt.author.username)
      }

      if (evt.guild) {
        const prefix = Bot.$getConfs(evt, 'prefix')
        str = str.split('{pre}').join(prefix)
        str = str.split('{guild.name}').join(evt.guild.name)
        str = str.split('{guild.id}').join(evt.guild.id)
        str = str.split('{guild.count}').join(evt.guild.memberCount)
        str = str.split('{guild.owner}').join(evt.guild.owner.user.username)
      }

      if (evt.options) {
        str = str.split('{msg}').join(evt.options.join(' '))
        str = str.split('{opts}').join(evt.options.join(' '))
        str = str.split('{args}').join(evt.options.length)
      }
    }

    str = str.split('{/').join('{')
    return str
  }

}