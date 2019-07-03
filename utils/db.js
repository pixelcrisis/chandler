// Database Connection
// Uses Lowdb, lodash

const low  = require('lowdb')
const Sync = require('lowdb/adapters/FileSync')

const fs = new Sync('data/db.json')
const db = low(fs)

module.exports = {
  db,

  get: function(key) {
    return this.db.get(key).value()
  },

  find: function(key, val) {
    return this.db.get(key).find(val).value()
  },

  set: function(key, val) {
    return this.db.set(key, val).write()
  },

  add: function(key, val) {
    let found = this.db.get(key).find({ id: val.id })
    let old = found.value()

    if (old) found.assign(val).write()
    else this.db.get(key).push(val).write()
  },

  rem: function(key, val) {

  }
}