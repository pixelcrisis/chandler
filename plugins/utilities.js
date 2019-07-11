// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

const Loader = require('./loader.js')

module.exports = (Bot) => {

  Bot.aliases = {}
  Bot.commands = {}

  Bot.loadGuilds = Loader.guilds
  Bot.loadEvents = Loader.events
  Bot.loadCommands = Loader.commands

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot._logger) Bot._logger.send(message)
  }

}