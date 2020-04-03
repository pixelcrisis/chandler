// utility.js - generalized helper functions

const { Permissions } = require('discord.js')
const Moment = require('moment')

module.exports = Chandler => {

  Chandler.ready = false

  // Quick test if string is negative or positive
  const positive = ['y', 'yes', 'on', 'true', 'enable']
  const negative = ['n', 'no', 'off', 'false', 'disable']
  Chandler.isYes = str => positive.includes(str.toLowerCase())
  Chandler.isNo  = str => negative.includes(str.toLowerCase())

  // Check if a message exists before deleting it
  Chandler.deleteMessage = Msg => {
    try { Msg.delete() }
    catch (e) {}
  }

  // Convert true/false to On/Off
  Chandler.onOff = bool => bool ? 'On' : 'Off'

  // Shorthand for sleep(300) in the form of wait(300)
  Chandler.wait = require('util').promisify(setTimeout)

  // For humanizing timestamps
  Chandler.when = time => Moment(time).fromNow()

  // For using Discord Permissions Utility
  Chandler.perm = str => new Permissions(str)

  // For converting color between hex and discord readable
  Chandler.getColor = s => {
    // make sure we start with a # to denote a hex code
    if (s.indexOf('#') != 0) return 0
    s = s.slice(1).trim()
    // check if a 3 character hex code, expand to 6 if so
    if (s.length == 3) s = `${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`
    // if it looks like a hex code, return and convert!
    return s.length == 6 ? parseInt(s, 16) : 0
  }
  
}
