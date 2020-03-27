// error.js - Handles discord.js errors

module.exports = (Chandler, err) => {

  // plugins/logging.js
  return Chandler.post(err, 'Discord.JS Err')

}