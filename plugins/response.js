// response.js - for responding

module.exports = Chandler => {

  // If we can send a message, send it
  Chandler.reply = (Msg, data, str1, str2) => {
    if (!Chandler.canSendMessages(Msg)) return false
    // all of our data goes through the parser
    let response = Chandler.parse(Msg, data, str1, str2)
    response = Chandler.splitResponse(response)
    for (let i = 0; i < response.length; i++) {
      if (i == response.length - 1) return Msg.channel.send(response[i])
      else Msg.channel.send(response[i])
    }
  }

  // Deletes a response after two seconds
  Chandler.replyFlash = async (Msg, data, str1, str2) => {
    const flashed = await Chandler.reply(Msg, data, str1, str2)
    await Chandler.wait(2000)
    if (Chandler.canManageMessages(flashed)) flashed.delete()
  }

  // The parser. I'm so sorry.
  Chandler.parse = (Msg, str, val1, val2) => {
    // Check if str is actually an object
    // And if so, pass it off to quickEmbed
    if (str && !Array.isArray(str) && typeof str === 'object') {
      return Chandler.quickEmbed(Msg, str, val1, val2)
    }
    // Otherwise, just return str if not a string
    else if (typeof str != 'string') return str

    str = str.split('{{ ').join('```js\n')
    str = str.split('{{').join('```js\n')
    str = str.split(' }}').join('\n```')
    str = str.split('}}').join('\n```')
    str = str.split(' || ').join('\n')
    str = str.split('||').join('\n')

    str = str.split('{val1}').join(val1)
    str = str.split('{val2}').join(val2)
    
    str = str.split('{bot}').join(`<@${Chandler.user.id}>`)
    str = str.split('{ver}').join(Chandler.Info.version)
    str = str.split('{guilds}').join(Chandler.guilds.cache.keyArray().length)

    str = str.split('{guides}').join(Chandler.URL.help)
    str = str.split('{invite}').join(Chandler.URL.invite)
    str = str.split('{docs}').join(Chandler.URL.docs)
    str = str.split('{server}').join(Chandler.URL.guild)
    str = str.split('{vote}').join(Chandler.URL.vote)
    str = str.split('{timezones}').join(Chandler.URL.zones)
    str = str.split('{embeds}').join(Chandler.URL.embed)
    str = str.split('{getids}').join(Chandler.URL.getids)

    if (Msg) {
      if (Msg.author) {
        str = str.split('{user}').join(`<@${Msg.author.id}>`)
        str = str.split('{user.id}').join(Msg.author.id)
        str = str.split('{user.name}').join(Msg.author.username)
      }

      if (Msg.guild) {
        str = str.split('~/').join(Msg.config.prefix)
        str = str.split('{guild.name}').join(Msg.guild.name)
        str = str.split('{guild.id}').join(Msg.guild.id)
        str = str.split('{guild.count}').join(Msg.guild.memberCount)
        str = str.split('{guild.owner}').join(`<@${Msg.guild.owner.user.id}>`)
      }

      if (Msg.args) {
        str = str.split('{msg}').join(Msg.args.join(' '))
        str = str.split('{opts}').join(Msg.args.join(' '))
        str = str.split('{args}').join(Msg.args.length)
      }
    }

    // un-escape any escaped keys
    str = str.split('{/').join('{')

    return str
  }

  // Custom shorthand for embeds
  Chandler.quickEmbed = (Msg, obj, val1, val2) => {
    let embed = { author: {} }
    for (let prop in obj) {
      // parse the property if it's a string
      let isStr = typeof obj[prop] === 'string'
      let data = isStr ? Chandler.parse(Msg, obj[prop], val1, val2) : obj[prop]

      // apply our shorthands
      if (prop == 'name') embed.author.name = data
      else if (prop == 'desc') embed.description = data
      else embed[prop] = data
    }

    // split apart long embeds
    let stringed = JSON.stringify(embed)
    if (stringed.length > 1995) {
      let embeds = []
      let divisions = Math.ceil(stringed.length / 1995)
      let split = embed.description.match(/[\s\S]{1,1995}/g)
      for (let i = 0; i < split.length; i++) {
        let newEmbed = { ...embed }
        newEmbed.description = split[i]
        embeds.push({ embed: newEmbed })
      }
      return embeds
    }
    else return [{ embed }]
  }

  // Split apart long messages
  Chandler.splitResponse = response => {
    // if response is already split...
    if (Array.isArray(response)) return response
    
    if (response.length > 1995) response = response.match(/[\s\S]{1,1995}/g)
    else response = [ response ]

    return response
  }

  // escape variables that need to be printed instead of parsed
  Chandler.escape = str => str ? str.split('{').join('{/') : false

  // clean messages for safety, only used for sudo commands
  Chandler.clean = data => {
    // if it's an object / array, we'll break it down with inspect
    const inspect = data => require('util').inspect(data, { depth: 2 })
    if (typeof data !== 'string') data = inspect(data)

    // now we basically just remove any sensitive information, if any
    const dbl = Chandler.Conf.dbl
    const sensitive = [ Chandler.token, dbl.auth, dbl.token ]

    for (let i = sensitive.length - 1; i >= 0; i--) {
      if (sensitive[i]) data = data.split(sensitive[i]).join('t0k3n')
    }

    // and then we pretty print!
    return ['```js', data, '```'].join('\n')
  }

}
