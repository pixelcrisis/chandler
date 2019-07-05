// Embed Utility Partial

module.exports = {

  parse: function(str) {
    try {
      let obj = JSON.parse(str)
      return obj.embed ? obj : { embed: obj }
    }
    catch(e) { return false }
  },

  make: function(desc, title, obj) {
    let res = {
      color: 5873868,
      description: desc ? desc : '',
      author: { name: title ? title : '' }
    }
    return { embed: Object.assign(res, obj) }
  }

}