// Chandler State
// Caches settings locally

const Enmap = require('enmap')
const encfg = { fetchAll: false, autoFetch: true, cloneLevel: 'deep' }


module.exports = (Bot) => {

  Bot.confs = new Enmap({ name: 'confs', ...encfg })
  Bot.locks = new Enmap({ name: 'locks', ...encfg })
  Bot.zones = new Enmap({ name: 'zones', ...encfg })
  Bot.notes = new Enmap({ name: 'notes', ...encfg })

  // getters

  Bot.getConf = (guild, key) => {
    Bot.confs.ensure(guild, { prefix: '~/', warnings: true })
    return Bot.confs.get(guild, key ? key : null)
  }

  Bot.getLock = (guild, key) => {
    Bot.locks.ensure(guild, {})
    return Bot.locks.get(guild, key ? key : null)
  }

  Bot.getZone = (guild, key) => {
    Bot.zones.ensure(guild, {})
    return Bot.zones.get(guild, key ? key : null)
  }

  Bot.getNote = (guild, key) => {
    Bot.notes.ensure(guild, {})
    return Bot.notes.get(guild, key ? key : null)
  }

  // setters

  Bot.setConf = (guild, key, val) => Bot.confs.set(guild, val, key)
  Bot.setLock = (guild, key, val) => Bot.locks.set(guild, val, key)
  Bot.setZone = (guild, key, val) => Bot.zones.set(guild, val, key)
  Bot.setNote = (guild, key, val) => Bot.notes.set(guild, val, key)

  // deletters

  Bot.remLock = (guild, key) => Bot.locks.delete(guild, key)
  Bot.remZone = (guild, key) => Bot.zones.delete(guild, key)
  Bot.remNote = (guild, key) => Bot.notes.delete(guild, key)

  // deletes ALL of our confs for a guild
  Bot.remConf = (guild) => {
    if (Bot.confs.has(guild)) Bot.confs.delete(guild)
  }

}