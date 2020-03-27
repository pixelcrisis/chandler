// logging.js - for logging, publically and internally

module.exports = Chandler => {

  Chandler.logBook = []

  Chandler.log = str => {
    console.info(str)
    Chandler.logBook.push(str)
    if (Chandler.logBook.length > 20) Chandler.logBook.shift()
  }

  Chandler.post = (description, name) => {
    description = description.stack || description
    Chandler.log(`${name ? name + ': ' : ''}${description}`)
    const response = { author: { name }, description }
    const channel = Chandler.channels.cache.get(Chandler.Conf.logs)
    if (channel) Chandler.reply({ channel, log: true }, response)
  }
  
}
