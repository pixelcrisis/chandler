// Utility Functions
// For General Use

const Moment = require('moment')
const DB     = require('./db.js')

module.exports = {

  // time ago getter
  ago: function(time) { return Moment(time).fromNow() },

  // message parser 
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

  // parse embed from command
  getEmbed: function(str) {
    try {
      let obj = JSON.parse(str)
      return obj.embed ? obj : { embed: obj }
    }
    catch(e) { return false }
  },

  // get user/channel from message
  strip: function(str) {
    if (str.indexOf('<') == 0) {
      return str.substring(2, str.length - 1)
    } else return str
  },

  // quick embed shorthand
  box: function(desc, title, obj) {
    let res = {
      color: 5873868,
      description: desc ? desc : '',
      author: { name: title ? title : '' }
    }
    return { embed: Object.assign(res, obj) }
  },

  // discord limits us to 2k characters
  // if our embed goes over that, we split it up
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