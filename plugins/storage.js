// storage.js - storing and retrieving data

const Enmap = require('enmap')
const encfg = { fetchAll: false, autoFetch: true, cloneLevel: 'deep' }

// define our defaults
const defaults = {
  confs: { prefix: '~/' }, 
  locks: {}, zones: {}, notes: {}, stars: {}, votes: 0,
  rules: Msg => {
    return {
      list: [],
      post: null,
      title: `${Msg.guild.name} Rules`,
      intro: 'Fair warning: Any rule breaking may lead to a kick or ban!',
      outro: 'Thanks for taking the time to read the rules, enjoy the server!'
    }
  }
}

module.exports = Chandler => {

  // Define our different stores
  Chandler.$confs = new Enmap({ name: 'confs', ...encfg })
  Chandler.$rules = new Enmap({ name: 'rules', ...encfg })
  Chandler.$locks = new Enmap({ name: 'locks', ...encfg })
  Chandler.$zones = new Enmap({ name: 'zones', ...encfg })
  Chandler.$notes = new Enmap({ name: 'notes', ...encfg })
  Chandler.$votes = new Enmap({ name: 'votes', ...encfg })
  Chandler.$stars = new Enmap({ name: 'stars', ...encfg })

  // Really DRY Getter
  Chandler.$get = (store, Msg, key) => {
    Chandler[`$${store}`].ensure(Msg.guild.id, defaults[store])
    return Chandler[`$${store}`].get(Msg.guild.id, key || null)
  }

  // Really DRY Setter
  Chandler.$set = (store, Msg, key, val) => {
    Chandler[`$${store}`].ensure(Msg.guild.id, defaults[store])
    return Chandler[`$${store}`].set(Msg.guild.id, val, key)
  }

  // Really DRY Adder (push to array)
  Chandler.$add = (store, Msg, key, val) => {
    return Chandler[`$${store}`].push(Msg.guild.id, val, key)
  }

  // Really DRY Delete
  Chandler.$rem = (store, Msg, key, path) => {
    return Chandler[`$${store}`].delete(Msg.guild.id, key, path)
  }

  // Less DRY
  Chandler.$getVote = user => Chandler.$votes.ensure(user, defaults.votes)
  Chandler.$setVote = (user, now) => Chandler.$votes.set(user, now)

}
