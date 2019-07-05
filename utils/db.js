// Database Connection
// Uses MongoDB

const mongoose = require('mongoose')
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/chandler', {
  useNewUrlParser: true
})

const model = mongoose.Schema({
  guild:  { type: String, default: '' },
  prefix: { type: String, default: '>' },
  modID:  { type: String, default: '' },
  speak:  { type: String, default: '' },
  zones:  { type: [],     default: [] },
  locks:  { type: [],     default: [] },
  comms:  { type: {},     default: {} }
})
const Settings = mongoose.model('Settings', model)

module.exports = {

  state: {},

  save: async function(guild) {
    return Settings.findOneAndUpdate({ guild }, this.state[guild])
  },

  load: async function(guild) {
    let result
    await Settings.findOne({ guild }, (err, cfg) => {
      if (err) console.log(err)
      if (!cfg) {
        const newCfg = new Settings({ guild })
        newCfg.save().catch(err => console.log)
        result = newCfg
      } else {
        // ghetto migrations
        if (!cfg.locks) cfg.locks = []
        if (!cfg.comms) cfg.comms = {}
        result = cfg
      }
    })
    this.state[guild] = result
    return result
  },

  loadAll: async function(ids) {
    let result = {}
    for (var i = 0; i < ids.length; i++) {
      let guild = ids[i]
      result[ids[i]] = await this.load(ids[i])
    }
    return result
  },

  get: function(guild, key) {
    return this.state[guild][key]
  },

  find: function(guild, key, id) {
    return this.state[guild][key].find(by => by.id == id)
  },

  set: function(guild, key, val) {
    this.state[guild][key] = val
    this.save(guild)
  },

  add: function(guild, repo, key, val) {
    this.state[guild][repo][key] = val
    this.save(guild)
  },

  rem: function(guild, repo, key) {
    delete this.state[guild][repo][key]
    this.save(guild)
  },

  push: function(guild, key, val) {
    let arr = this.state[guild][key]
    let index = arr.findIndex(by => by.id == val.id)
    if (index > -1) this.state[guild][key][index] = val
    else this.state[guild][key].push(val)
    this.save(guild)
  },

  pull: function(guild, key, val) {
    let arr = this.state[guild][key]
    let index = arr.findIndex(by => by.id == val.id)
    if (index > -1) this.state[guild][key].splice(index, 1)
    this.save(guild)
  }

}