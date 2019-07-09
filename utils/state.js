// Database Connection Partial
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

  data: {},

  async save(guild) {
    return Settings.findOneAndUpdate({ guild }, this.data[guild])
  },

  async load(guild) {
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
    this.data[guild] = result
    return result
  },

  async loadAll(ids) {
    let result = {}
    for (var i = 0; i < ids.length; i++) {
      let guild = ids[i]
      result[ids[i]] = await this.load(ids[i])
    }
    return result
  },

  get(guild, key) {
    return this.data[guild][key]
  },

  find(guild, key, id) {
    return this.data[guild][key].find(by => by.id == id)
  },

  set(guild, key, val) {
    this.data[guild][key] = val
    this.save(guild)
  },

  add(guild, repo, key, val) {
    this.data[guild][repo][key] = val
    this.save(guild)
  },

  rem(guild, repo, key) {
    delete this.data[guild][repo][key]
    this.save(guild)
  },

  push(guild, key, val) {
    let arr = this.data[guild][key]
    let index = arr.findIndex(by => by.id == val.id)
    if (index > -1) this.data[guild][key][index] = val
    else this.data[guild][key].push(val)
    this.save(guild)
  },

  pull(guild, key, val) {
    let arr = this.data[guild][key]
    let index = arr.findIndex(by => by.id == val.id)
    if (index > -1) this.data[guild][key].splice(index, 1)
    this.save(guild)
  }

}