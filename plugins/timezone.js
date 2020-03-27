// timezone.js - time tracking utilities

const Moment = require('moment-timezone')

// set up our string (and regex) time constants
// Format used to format, Regex used to test options
const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'h:mm A'
const fullFormat = `${dateFormat} ${timeFormat}`
const clockRegex = /\b([1-9]|1[0-2])(:\d{2})?\s*(a|p|am|pm)\b/i

// set up some basic data arrays
const months = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ]
const places = [ 'africa', 'america', 'asia', 'atlantic', 'australia', 'europe', 'indian', 'pacific' ]

// sort by time offset from GMT
// this sorts time from morn to night
const byTime = (a,b) => a.off > b.off ? 1 : -1

module.exports = Chandler => {

  // find a time in a time zone
  Chandler.getTimeInZone = (zone, time) => {
    // use a time if we got one, otherwise use now
    let result = time ? time.tz(zone) : Moment.tz(zone)

    // add some values for readability
    result.time = result.format(timeFormat)
    // turn America/Los_Angeles into Los Angeles
    result.name = zone.split('/')[1].split('_').join(' ')

    return result
  }

  // sort all timezones in a server
  Chandler.getTimeZoneTable = (zones, time) => {
    let table = {}

    for (let user in zones) {
      const zone = zones[user]
      const when = Chandler.getTimeInZone(zone, time)

      // add zone to table if not defined yet
      if (!table.hasOwnProperty(zone)) {
        table[zone] = {
          off: when._offset,
          name: when.name,
          time: when.time,
          users: [ user ]
        }
      }

      // else just push the user to the zone
      else table[zone].users.push(user)
    }

    // define and sort our result
    let result = Object.values(table)
    result = result.sort(byTime)
    return result
  }

  // check and see if a zone exists
  Chandler.getTimeZone = opt => {
    let name = opt.split(' ').join('_').toLowerCase()
    // if they sent us a full timezone string, return it
    if (name.indexOf('/') > -1) return Moment.tz.zone(name)

    // otherwise literally try and find it manually
    // we do this by looping the 'places' with the name
    for (let place of places) {
      let zone = Moment.tz.zone(`${place}/${name}`)
      // only return if we have a zone, that way we keep looking
      if (zone) return zone
    }

    // guess we couldn't find one
    return false
  }

  // turn a string "9p" into a timestamp
  Chandler.getTimeFromString = (str, zone) => {
    // test our time string for validity
    let time = clockRegex.exec(str)
    if (!time) return false

    // get the current date
    const date = Moment.tz(zone).format(dateFormat)

    // convert to a proper timestamp
    const hour = time[1]
    const mins = time[2] || ":00"
    const ampm = time[3].toUpperCase()

    const stamp = `${date} ${hour}${mins} ${ampm}`

    // return the time in the timezone
    return Moment.tz(stamp, fullFormat, zone)
  }

}
