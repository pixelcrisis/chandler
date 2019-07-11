// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

module.exports = (Bot) => {

  Bot.Log = (message) => {
    console.info(message)
    if (Bot.Logger) Bot.Logger.send(message)
  }

}