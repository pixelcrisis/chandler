// Chandler Reply Functions
// This handles what Chandler says

module.exports = (Bot) => {

  const website = '[Website](https://chandler.12px.io)'
  const support = '[Support Server](https://discord.gg/tjRC7E4)'
  const invite = '[Invite Me](https://discordapp.com/api/oauth2/authorize?client_id=596194094275887116&permissions=8&scope=bot)'

  Bot.escape = (data) => data.split('{').join('{/')

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
        const prefix = Bot.getConfig(msg.guild.id, 'prefix')
        data = data.split('{pre}').join(prefix)
      }
    }
    // unescape escaped parse flags
    data = data.split('{/').join('{')
    return data
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

  Bot.listReply = (msg, title, data, join = '\n') => {
    // due to discord text limits
    // if we're sending array data
    // split it at the 2k limit
    let text = '', messages = []
    for (var i = 0; i < data.length; i++) {
      if (!text) text = data[i]
      else {
        let len = text.length + data[i].length + join.length
        if (len >= 1850) messages.push(text)
        text = len < 1850 ? `${text}${join}${data[i]}` : `${data[i]}`        
      }
    }
    if (text) messages.push(text)
    // now we have an array of messages plit at 2k characters
    // now we print them one by one
    for (var i = 0; i < messages.length; i++) {
      let embed = {
        description: messages[i],
        author: { name: Bot.parse(msg, title) },
        footer: { text: `Page ${i + 1}/${messages.length}` }
      }
      return msg.channel.send({ embed })
    }
  }

}