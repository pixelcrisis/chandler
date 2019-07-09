// Database Management

const Model  = require('./model.js')
const Mongo  = require('mongodb').MongoClient
const Client = new Mongo('mongodb://localhost:27017', {
  useNewUrlParser: true
})

const Zoneing = new Model('zoneing')
const Aliases = new Model('aliases')
const Locking = new Model('locking')
const Configs = new Model('configs', { prefix: '>' })

const getIndex = (arr, id) => arr.findIndex(i => i.id == id)

module.exports = {

  data: {},

  async load(guilds) {
    await Client.close()
    await Client.connect()
    for (var i = 0; i < guilds.length; i++) {
      let guild = guilds[i]
      this.data[guild] = {}
      let state = this.data[guild]
      const db = Client.db(guild)
      
      state.configs = await Configs.load(db)
      state.aliases = await Aliases.load(db)
      state.locking = await Locking.load(db)
      state.zoneing = await Zoneing.load(db)

      state.configs = state.configs[0]
    }
  },

  fetch(guild, key) {
    return this.data[guild][key]
  },

  getConfig(guild, key) {
    return this.data[guild].configs[key]
  },

  getAlias(guild, id) {
    return this.data[guild].aliases.find(by => by.id == id)
  },

  getLock(guild, id) {
    return this.data[guild].locking.find(by => by.id == id)
  },

  getZone(guild, id) {
    return this.data[guild].zoneing.find(by => by.id == id)
  },

  setConfig(guild, key, val) {
    this.data[guild].configs[key] = val
    const db = Client.db(guild)
    Configs.save(db, key, val)
  },

  addAlias(guild, id, message) {
    let state = this.data[guild].aliases
    let index = getIndex(state, id)
    if (index > -1) state[index] = { id, message }
    else state.push({ id, message })
    const db = Client.db(guild)
    Aliases.push(db, { id, message })
  },

  remAlias(guild, id) {
    let state = this.data[guild].aliases
    let index = getIndex(state, id)
    state.splice(index, 1)
    const db = Client.db(guild)
    Aliases.pull(db, id)
  },

  addLock(guild, data) {
    let state = this.data[guild].locking
    let index = getIndex(state, data.id)
    if (index > -1) state[index] = data
    else state.push(data)
    const db = Client.db(guild)
    Locking.push(db, data)
  },

  remLock(guild, id) {
    let state = this.data[guild].locking
    let index = getIndex(state, id)
    state.splice(index, 1)
    const db = Client.db(guild)
    Locking.pull(db, id)
  },

  addZone(guild, id, zone) {
    let state = this.data[guild].zoneing
    let index = getIndex(state, id)
    if (index > -1) state[index] = { id, zone }
    else state.push({ id, zone })
    const db = Client.db(guild)
    Zoneing.push(db, { id, zone })
  },

  remZone(guild, id) {
    let state = this.data[guild].zoneing
    let index = getIndex(state, data.id)
    state.splice(index, 1)
    const db = Client.db(guild)
    Zoneing.pull(db, id)
  }

}