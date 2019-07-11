// Database Management

module.exports = function(coll, defaults) {

  this.coll = coll
  this.defaults = defaults
  const update = { upsert: true }

  this.load = async function(db) {
    const coll = db.collection(this.coll)
    const docs = await coll.find({}).toArray()
    if (docs.length) return docs
    else return this.make(db)
  }

  this.make = async function(db) {
    if (!this.defaults) return []
    const coll = db.collection(this.coll)
    await coll.insertOne(this.defaults)
    return [ this.defaults ]
  }

  this.save = async function(db, key, val) {
    let obj = { $set: {} }
    obj.$set[key] = val
    const coll = db.collection(this.coll)
    await coll.updateOne({}, obj, update)
    return obj
  }

  this.push = async function(db, data) {
    let id = data.id
    let obj = { $set: data }
    const coll = db.collection(this.coll)
    await coll.updateOne({ id }, obj, update)
    return obj
  }

  this.pull = async function(db, id) {
    const coll = db.collection(this.coll)
    await coll.deleteOne({ id })
    return id
  }
}