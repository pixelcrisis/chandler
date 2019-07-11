// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

const Load = require('./loader.js')

module.exports = (Bot) => {

  Bot.aliases = {}
  Bot.commands = {}

  Bot.loadEvents = Load.events
  Bot.loadCommands = Load.commands

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot.Logger) Bot.Logger.send(message)
  }

}