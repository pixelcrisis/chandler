// utility.js
// generalized helper functions

const { Permissions } = require('discord.js')
const Moment          = require('moment')

module.exports = Bot => {

  Bot.ready = false

  Bot.isY = str => ['y', 'yes', 'on', 'true', 'enable'].includes(str.toLowerCase())
  Bot.isN = str => ['n', 'no', 'off', 'false', 'disable'].includes(str.toLowerCase())

  Bot.wait = require('util').promisify(setTimeout)
  Bot.when = time => Moment(time).fromNow()

  Bot.perm = str => new Permissions(str)

  Bot.getColor = s => {
    if (s.indexOf('#') != 0) return 0
    s = s.slice(1).trim()
    if (s.length == 3) s = `${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`
    return s.length == 6 ? parseInt(s, 16) : 0
  }

  Bot.log = (evt, err) => {
    if (typeof evt == 'string') evt = { log: { desc: evt } }
    if (typeof evt.log == 'string') evt.log = { desc: evt.log }
    const guild = evt.guild ? evt.guild.name : '>'
    evt.isLog = true

    if (evt.config) {
      let savedLogs = evt.config.logged || []
      if (savedLogs.length > 2) savedLogs.shift()
      savedLogs.push(evt.log.name || evt.log.desc)
      Bot.$setConf(evt, 'logged', savedLogs)
    }

    if (err) {
      console.log(guild, err)
      evt.log.desc += `{{${err}}}`
    }
    else console.info(guild, evt.log.name || evt.log.desc)

    evt.channel = Bot.channels.get(Bot.conf.logs)
    if (!evt.silent) Bot.reply(evt, evt.log)
  }

}