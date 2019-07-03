// Utility Functions
// For the Zoning Plugin

const Moment = require('moment-timezone')

module.exports = {

  // find zone
  findZone: function(name) { 
    name = name.join('_').toLowerCase()
    return Moment.tz.zone(name) 
  },

  // find when from a string
  findWhen: function(time, zone) {
    const reg = /\b([1-9]|1[0-2])(:\d{2})?\s*(a|p|am|pm)\b/i
    let match = reg.exec(time)
    if (match) {
      let hour = match[1]
      let mins = match[2] ? match[2] : ":00"
      let nite = match[3].toUpperCase()
      let day = Moment.tz(zone).format('YYYY-MM-DD')
      let str = `${day} ${hour}${mins} ${nite}`
      return Moment.tz(str, 'YYYY-MM-DD h:mm A', zone)
    } else {
      return false
    }
  },

  // convert zoning data to sorted table
  sortTable: function(data, when) {
    let table = {}, sorted = {}, result = []
    for (var i = data.length - 1; i >= 0; i--) {
      let user = data[i];
      if (table.hasOwnProperty(user.zone)) {
        table[user.zone].push(user.id)
      } else table[user.zone] = [ user.id ]
    }
    for (var zone in table) {
      if (when == 'now') {
        let time = Moment.tz(zone)
        sorted[zone] = {
          off: time._offset,
          time: time.format('h:mm A'),
          users: table[zone]
        }
      } else {
        sorted[zone] = {
          off: when._offset,
          time: when.tz(zone).format('h:mm A'),
          users: table[zone]
        }
      }
    }
    for (var zone in sorted) {
      let temp = sorted[zone]
      temp.name = zone
      result.push(temp)
    }
    return result.sort((a,b) => a.off > b.off ? 1 : -1)
  }

}