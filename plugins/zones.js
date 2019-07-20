// Zones Utilities
// For use with commands/zones

const Moment = require('moment-timezone')

const timeReg = /\b([1-9]|1[0-2])(:\d{2})?\s*(a|p|am|pm)\b/i
const dateStr = 'YYYY-MM-DD'
const timeStr = 'h:mm A'
const fullStr = `${dateStr} ${timeStr}`

const byTime = (a, b) => a.off > b.off ? 1 : -1

module.exports = (Bot) => {

  Bot.findTimeZone = (name) => {
    return Moment.tz.zone(name.join('_').toLowerCase())
  }
  
  Bot.findTime = (time, zone) => {
    const match = timeReg.exec(time)
    if (!match) return false

    let hour = match[1]
    let mins = match[2] ? match[2] : ":00"
    let nite = match[3].toUpperCase()

    let day = Moment.tz(zone).format(dateStr)
    let str = `${day} ${hour}${mins} ${nite}`

    return Moment.tz(str, fullStr, zone)
  }

  Bot.sortTimeZones = (zones, time) => {
    let table = {}

    for (var id in zones) {
      let zone = zones[id]
      let when = time ? time.tz(zone) : Moment.tz(zone)

      if (!table.hasOwnProperty(zone)) {
        table[zone] = {
          name: zone.split('/')[1].split('_').join(' '),
          off: when._offset,
          time: when.format(timeStr),
          users: [ id ]
        }
      }
      else table[zone].users.push(id)
    }

    let result = Object.values(table)
    return result.sort(byTime)
  }

}