// Chandler State
// Caches settings locally
// Backed up via Mongo

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const cfg = { useNewUrlParser: true }
const Client = new MongoClient(url, cfg)

const Model = require('./state.model.js')
const Config = new Model('config', { prefix: '>' })
const Zones = new Model('zones')
const Locks = new Model('locks')
const Tags = new Model('tags')

module.exports = (Bot) => {

  Bot.state = {}

  Bot.getGuilds = async (guilds) => {
    // in case the bot restarts
    // close the connections before
    // opening a new one
    await Client.close()
    await Client.connect()
    Bot.log(`Loading ${guilds.length} Guilds...`)
    for (var i = 0; i < guilds.length; i++) {
      let result = {}
      let guild = guilds[i]
      const db = Client.db(guild)

      // propertis must match collection name
      result.config = await Config.load(db)
      result.zones = await Zones.load(db)
      result.locks = await Locks.load(db)
      result.tags = await Tags.load(db)

      // there's only one result in config, so
      result.config = result.config[0]

      Bot.state[guild] = result
    }
  }

  Bot.get = (guild, coll) => {
    return Bot.state[guild][coll]
  }

  Bot.getConfig = (guild, key) => {
    return Bot.state[guild].config[key]
  }

  Bot.getZone = (guild, id) => {
    return Bot.state[guild].zones.find(Bot.byID(id))
  }

  Bot.getLock = (guild, id) => {
    return Bot.state[guild].locks.find(Bot.byID(id))
  }

  Bot.getTag = (guild, id) => {
    return Bot.state[guild].tags.find(Bot.byID(id))
  }

  Bot.setConfig = (guild, data) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].config
    state = Config.set(db, state, data)
  }

  Bot.setZone = (guild, data) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].zones
    state = Zones.set(db, state, data)
  }

  Bot.remZone = (guild, id) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].zones
    state = Zones.rem(db, state, id)
  }

  Bot.setLock = (guild, data) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].locks
    state = Locks.set(db, state, data)
  }

  Bot.remLock = (guild, id) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].locks
    state = Locks.rem(db, state, id)
  }

  Bot.setTag = (guild, data) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].tags
    state = Tags.set(db, state, data)
  }

  Bot.remTag = (guild, id) => {
    const db = Client.db(guild)
    let state = Bot.state[guild].tags
    state = Tags.rem(db, state, id)
  }

}