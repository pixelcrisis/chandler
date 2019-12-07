// timezone.js
// for helping with user time tracking

const Moment = require('moment-timezone')

const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'h:mm A'
const fullFormat = `${dateFormat} ${timeFormat}`
const timeRegex = /\b([1-9]|1[0-2])(:\d{2})?\s*(a|p|am|pm)\b/i

const byTime = (a, b) => a.off > b.off ? 1 : -1

const continents = [ 
  'africa', 'america', 'asia', 'atlantic', 
  'australia', 'europe', 'indian', 'pacific'
]

module.exports = Bot => {

  Bot.getTime = (zone, time) => {
    let result = time ? time.tz(zone) : Moment.tz(zone)

    result.time = result.format(timeFormat)
    result.name = zone.split('/')[1].split('_').join(' ')

    return result
  }

  Bot.findTime = (time, zone) => {
    time = timeRegex.exec(time)
    if (!time) return false

    const hour = time[1]
    const mins = time[2] || ":00"
    const nite = time[3].toUpperCase()

    const day = Moment.tz(zone).format(dateFormat)
    const str = `${day} ${hour}${mins} ${nite}`

    return Moment.tz(str, fullFormat, zone)
  }

  Bot.findZone = (name) => {
    name = name.join('_').toLowerCase()
    if (name.indexOf('/') > -1) return Moment.tz.zone(name)

    for (let place of continents) {
      let zone = Moment.tz.zone(`${place}/${name}`)
      if (zone) return zone
    }

    return false
  }

  Bot.sortZones = (list, time) => {
    let table = {}

    for (let id in list) {
      const zone = list[id]
      const when = Bot.getTime(zone, time)

      if (!table.hasOwnProperty(zone)) {
        table[zone] = {
          off: when._offset,
          name: when.name,
          time: when.time,
          users: [ id ]
        }
      }
      else table[zone].users.push(id)
    }

    let result = Object.values(table)
    return result.sort(byTime)
  }

}