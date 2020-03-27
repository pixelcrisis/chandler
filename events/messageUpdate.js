// messageUpdate.js - Handles message updates for commands

module.exports = async (Chandler, oldMsg, newMsg) => {

  // plugins/command.js
  return Chandler.tryCommand(Chandler, newMsg)

}