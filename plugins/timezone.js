// timezone.js
// for helping with user time tracking

const Moment = require('moment-timezone')

const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'h:mm A'
const fullFormat = `${dateFormat} ${timeFormat}`
const clockRegex = /\b([1-9]|1[0-2])(:\d{2})?\s*(a|p|am|pm)\b/i

const data = {
  mon: ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
  con: ['africa','america','asia','atlantic','australia','europe','indian','pacific']
}

const byTime = (a, b) => a.off > b.off ? 1 : -1

module.exports = Bot => {

  Bot.timeStr = (time) => time.format(fullFormat)
  Bot.strTime = (str, zone) => Moment.tz(str, fullFormat, zone)
  Bot.diffTime = (mill) => Moment.duration(mill).humanize()

  Bot.getTime = (zone, time) => {
    let result = time ? time.tz(zone) : Moment.tz(zone)

    result.time = result.format(timeFormat)
    result.name = zone.split('/')[1].split('_').join(' ')

    return result
  }

  Bot.findTime = (time, zone, month, date) => {
    time = clockRegex.exec(time)
    if (!time) return false

    const hour = time[1]
    const mins = time[2] || ":00"
    const nite = time[3].toUpperCase()

    const now = Moment.tz(zone).format(dateFormat)
    const day = Bot.findDate(now, month, date)
    if (!day) return false

    const str = `${day} ${hour}${mins} ${nite}`
    return Moment.tz(str, fullFormat, zone)
  }

  Bot.findDate = (now, month, day) => {
    if (!day || !month) return now

    let date = now.split('-')

    let year = parseInt(date[0])
    let oldM = parseInt(date[1])
    let oldD = parseInt(date[2])

    let newM = data.mon.indexOf(month.toLowerCase()) + 1
    if (!newM) return false

    if (newM < oldM || newM == oldM && day < oldD) year += 1
    date[0] = year
    date[1] = newM
    date[2] = day

    return date.join('-')
  }

  Bot.findZone = (name) => {
    name = name.join('_').toLowerCase()
    if (name.indexOf('/') > -1) return Moment.tz.zone(name)

    for (let place of data.con) {
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