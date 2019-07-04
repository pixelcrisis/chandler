// Database Connection
// Uses MongoDB

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/chandler', {
  useNewUrlParser: true
})

const model = mongoose.Schema({
  guild:  { type: String, default: '' },
  prefix: { type: String, default: '>' },
  modID:  { type: String, default: '' },
  speak:  { type: String, default: '' },
  zones:  { type: [],     default: [] },
  locks:  { type: [],     default: [] }
})
const Settings = mongoose.model('Settings', model)

module.exports = {

  state: {},

  load: async function(guild) {
    let result
    await Settings.findOne({ guild }, (err, cfg) => {
      if (err) console.log(err)
      if (!cfg) {
        console.info("Creating Settings For: " + guild)
        const newCfg = new Settings({ guild })
        newCfg.save().catch(err => console.log)
        result = newCfg
      } else {
        // ghetto migration
        if (!cfg.locks) cfg.locks = []
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

  get: async function(guild, key) {
    let state = this.state
    if (state[guild]) return state[guild][key]
    let result
    await Settings.findOne({ guild }, (err, res) => {
      if (err) console.log(err)
      if (res) result = res[key]
      state[guild][key] = res[key]
    })
    return result
  },

  find: async function(guild, key, id) {
    let state = this.state
    let obj = state[guild][key].find(by => by.id == id)
    if (obj) return obj
    let result
    await Settings.findOne({ guild }, (err, res) => {
      if (err) console.log(err)
      let obj = res[key].find(by => by.id == id)
      if (obj) state[guild][key].push(obj)
      return obj
    })
  },

  set: function(guild, key, val) {
    this.state[guild][key] = val
    Settings.findOne({ guild }, (err, res) => {
      if (err) console.log(err)
      if (res) {
        res[key] = val
        res.save()
      }
    })
  },

  add: function(guild, key, val) {
    let arr = this.state[guild][key]
    let index = arr.findIndex(by => by.id == val.id)
    if (index > -1) this.state[guild][key][index] = val
    else this.state[guild][key].push(val)
    Settings.findOne({ guild }, (err, res) => {
      if (err) console.log(err)
      if (res) {
        let index = res[key].findIndex(by => by.id == val.id)
        if (index > -1) res[key][index] = val
        else res[key].push(val)
        res.save()
      }
    })
  }

}