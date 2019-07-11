// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

module.exports = (Bot) => {

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot._logger) Bot._logger.send(message)
  }

}