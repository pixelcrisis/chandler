// Chandler State
// Modeling our Data Structure

const getIndex = (arr, id) => arr.findIndex(i => i.id == id)

module.exports = function(collection, defaults) {

  this.coll = collection
  this.defaults = defaults
  const upgrade = { upsert: true }

  this.byID = (id) => { return el => el.id == id }

  this.load = async (db) => {
    const coll = db.collection(this.coll)
    const docs = await coll.find({}).toArray()
    return docs.length ? docs : this.make(db)
  }

  this.make = async (db) => {
    if (!this.defaults) return []
    const coll = db.collection(this.coll)
    await coll.insertOne(this.defaults)
    return [ this.defaults ]
  }

  this.set = async(db, state, data) => {
    let obj = { $set: data }
    let key = data.id ? { id: data.id } : {}
    const coll = db.collection(this.coll)
    coll.updateOne(key, obj, upgrade)
    // update the local state
    // if it has an ID, it belongs in an array
    if (data.id) {
      let index = getIndex(state, data.id)
      if (index > -1) state[index] = data
      else state.push(data)
    } 
    // otherwise, just update the setting
    else {
      for (var prop in data) {
        state[prop] = data[prop]
      }
    }
    return state
  }

  this.rem = async (db, state, id) => {
    // we never delete settings!
    if (this.coll == 'config') return state

    const coll = db.collection(this.coll)
    coll.deleteOne({ id })
    let index = getIndex(state, id)
    state.splice(index, 1)
    return state
  }

} 