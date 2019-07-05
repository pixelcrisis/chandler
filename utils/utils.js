// Utility Functions
// For General Use

const Moment = require('moment')

module.exports = {

  ago: function(time) { 
    return Moment(time).fromNow() 
  },

  parse: function(str, val1, val2) {
    let invite = '[Invite Link](https://discordapp.com/api/oauth2/authorize?client_id=596194094275887116&permissions=8&scope=bot)'
    let website = '[Command List](https://chandler.12px.io)'
    let support = '[Support Server](https://discord.gg/tjRC7E4)'

    str = str.split('{invite}').join(invite)
    str = str.split('{website}').join(website)
    str = str.split('{support}').join(support)
    if (val1) str = str.split('{val1}').join(val1)
    if (val2) str = str.split('{val2}').join(val2)
    return str
  },

  strip: function(str) {
    if (str.indexOf('<') == 0) {
      let trim = str.indexOf('@&') == 1 ? 3 : 2
      return str.substring(trim, str.length - 1)
    } else return str
  },

  split: function(data, join) {
    let text = '', messages = []
    for (var i = data.length - 1; i >= 0; i--) {
      let len = text.length + data[i].length + join.length
      if (len >= 1995) messages.push(text)
      text = len < 1995 ? `${text}${join}${data[i]}` : `${data[i]}`
    }
    if (text) messages.push(text)
    return messages
  }

}