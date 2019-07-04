// Utility Functions
// For General Use

const Moment = require('moment')
const DB     = require('./db.js')

module.exports = {

  // time ago getter
  ago: function(time) { return Moment(time).fromNow() },

  // message parser 
  parse: function(str, val1, val2) {
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