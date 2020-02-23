// database.js
// for interacting with stored data 

const Enmap = require('enmap')
const encfg = { fetchAll: false, autoFetch: true, cloneLevel: 'deep' }

const defaults = {
  conf: {
    prefix: '~/',
    warnings: true
  },
  rule: (evt) => {
    return {
      list: [],
      post: null,
      title: `${evt.guild.name} Rules`,
      intro: "Fair warning: Any rule breaking may lead to being kicked or banned!",
      outro: "Thanks for taking the time to read the rules, enjoy the server!"
    }
  }
}

module.exports = (Bot) => {

  Bot.$confs = new Enmap({ name: 'confs', ...encfg })
  Bot.$rules = new Enmap({ name: 'rules', ...encfg })
  Bot.$locks = new Enmap({ name: 'locks', ...encfg })
  Bot.$zones = new Enmap({ name: 'zones', ...encfg })
  Bot.$notes = new Enmap({ name: 'notes', ...encfg })
  Bot.$votes = new Enmap({ name: 'votes', ...encfg })

  Bot.$getConfs = (evt, key) => {
    Bot.$confs.ensure(evt.guild.id, defaults.conf)
    return Bot.$confs.get(evt.guild.id, key || null)
  }
  Bot.$getRules = (evt, key) => {
    Bot.$rules.ensure(evt.guild.id, defaults.rule(evt))
    return Bot.$rules.get(evt.guild.id, key || null)
  }
  Bot.$getLocks = (evt, key) => {
    Bot.$locks.ensure(evt.guild.id, {})
    return Bot.$locks.get(evt.guild.id, key || null)
  }
  Bot.$getZones = (evt, key) => {
    Bot.$zones.ensure(evt.guild.id, {})
    return Bot.$zones.get(evt.guild.id, key || null)
  }
  Bot.$getNotes = (evt, key) => {
    Bot.$notes.ensure(evt.guild.id, {})
    return Bot.$notes.get(evt.guild.id, key || null)
  }
  Bot.$getVotes = (usr, key) => Bot.$votes.ensure(usr, 0)

  Bot.$setConf = (evt, key, val) => {
    Bot.$confs.ensure(evt.guild.id, defaults.conf)
    return Bot.$confs.set(evt.guild.id, val, key)
  }
  Bot.$setRule = (evt, key, val) => {
    Bot.$rules.ensure(evt.guild.id, defaults.rule(evt))
    return Bot.$rules.set(evt.guild.id, val, key)
  }
  Bot.$setLock = (evt, key, val) => {
    Bot.$locks.ensure(evt.guild.id, {})
    return Bot.$locks.set(evt.guild.id, val, key)
  }
  Bot.$setZone = (evt, key, val) => {
    Bot.$zones.ensure(evt.guild.id, {})
    return Bot.$zones.set(evt.guild.id, val, key)
  }
  Bot.$setNote = (evt, key, val) => {
    Bot.$notes.ensure(evt.guild.id, {})
    return Bot.$notes.set(evt.guild.id, val, key)
  }

  Bot.$setVote = (user, now) => Bot.$votes.set(user, now)

  Bot.$addConf = (evt, key, val) => Bot.$confs.push(evt.guild.id, val, key)
  Bot.$addRule = (evt, key, val) => Bot.$rules.push(evt.guild.id, val, key)

  Bot.$remRule = (evt, key, path) => Bot.$rules.delete(evt.guild.id, key, path)
  Bot.$remLock = (evt, key, path) => Bot.$locks.delete(evt.guild.id, key, path)
  Bot.$remZone = (evt, key, path) => Bot.$zones.delete(evt.guild.id, key, path)
  Bot.$remNote = (evt, key, path) => Bot.$notes.delete(evt.guild.id, key, path)

  Bot.$remConf = (guild) => {
    if (Bot.$confs.has(guild)) Bot.$confs.delete(guild)
  }

}