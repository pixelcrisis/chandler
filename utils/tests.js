// Command Testing Utility
// Bot Owner Only

const user = '200944208855433220'
const staff = '596192935138033675'
const channel = '596837986356690954'

const sleep = ms => new Promise(res => setTimeout(res, ms))
const Reply = (msg, str, results) => {
  if (results) str = str += '\n\n' + results.join('\n')
  return msg.channel.send({ 
    embed: { description: str, color: 16736084 } 
  })
}

module.exports = {

  run: async function(msg, opts, plugins) {
    let plug = opts[0], count = 0
    if (this[plug]) await this[plug](msg, plugins[plug])
    else if (plug == 'all') {
      Reply(msg, '***FULL TEST STARTING***')
      for (var plugin in plugins) {
        count += 1
        await this[plugin](msg, plugins[plugin], count)
        await sleep(10000)
      }
    } 
    return Reply(msg, 'Testing Completed.')
  },

  manager: async function(msg, plugin, count) {
    Reply(msg, 'Testing Manager...')
    await plugin.help(msg, [])
    await plugin.invite(msg, [])
    await plugin.prefix(msg, [])
    await plugin.prefix(msg, ['~'])
    await plugin.staff(msg, [])
    await plugin.staff(msg, ['gibberish'])
    await plugin.staff(msg, [ staff ])
    await plugin.roles(msg, [])

    return Reply(msg, `Finished Test ${count}.`, [
      '`Help()` - Message', 
      '`Invite()` - Message',
      '`prefix()` - Useage',
      '`prefix(~)` - Changed',
      '`staff()` - Curr',
      '`staff(gibberish)` - Bad Role',
      '`staff(id)` - Set Staff',
      '`roles()` - List`'
    ])
  },

  editing: async function(msg, plugin, count) {
    Reply(msg, 'Testing Editing...')
    await plugin.embed(msg, ['string'], true)
    await plugin.embed(msg, ['{','"title":','"Embed Test"','}'], true)
    await plugin.print(msg, ['1'], true)
    await msg.channel.send('Deleted 1')
    await msg.channel.send('Deleted 2')
    await msg.channel.send('sim >clear')
    await plugin.clear(msg, [])
    await plugin.clear(msg, ['2'])
    await plugin.edit(msg, [], true)
    await plugin.edit(msg, ['string'], true)
    await plugin.edit(msg, ['string', 'thing'], true)

    await msg.channel.send('_ _').then(async m => {
      await plugin.edit(msg, [m.id, 'String Edit'], true)
    })

    await msg.channel.send('_ _').then(async m => {
      await plugin.edit(msg, [m.id, '{ "title": "Embed Edit "}'], true)
    })

    return Reply(msg, `Finished Test ${count}.`, [
      '`embed(string)` - Bad Parse',
      '`embed(embed) - Embed Test`',
      '`print()` - Message ID',
      '`edit()` - Useage',
      '`clear()` - Useage',
      '`clear(2)` - Cleared Deleted',
      '`edit(string)` - Useage',
      '`edit(string, thing) - Bad Message`',
      '`edit(id, string) - String Edit`',
      '`edit(id, embed) - Embed Edit`',
    ])
  },

  locking: async function(msg, plugin, count) {
    Reply(msg, 'Testing Locking...')
    await plugin.lock(msg, [])
    await sleep(5000)
    await plugin.unlock(msg, [])
    return Reply(msg, `Finished Test ${count}.`, [
      '`lock()` - good',
      '`unlock()` - good'
    ])
  },

  shifter: async function(msg, plugin, count) {
    Reply(msg, 'Testing Shifter...')
    await plugin.shift(msg, [])
    await plugin.shift(msg, ['2'])
    await plugin.shift(msg, ['a', 'oh'])
    await msg.channel.send('Shift Test 1')
    await msg.channel.send('Shift Test 2')
    await msg.channel.send('Shift Test 3')
    await plugin.shift(msg, ['2',  channel ])
    return Reply(msg, `Finished Test ${count}.`, [
      '`shift()` - Useage',
      '`shift(2)` - Useage',
      '`shift(a, oh)` - Bad Channel',
      '`shift(2, channel)` - Shifted'
    ])
  },

  talking: async function(msg, plugin, count) {
    Reply(msg, 'Testing Talking...')
    await plugin.speak(msg, [])
    await plugin.speak(msg, ['oh'])
    await plugin.speak(msg, [ channel ])
    await plugin.speak(msg, [ channel , 'message'])
    await plugin.say(msg, [])
    await plugin.say(msg, ['say','test!'])
    return Reply(msg, `Finished Test ${count}.`, [
      '`speak()` - Curr',
      '`speak(oh)` - Bad Channel',
      '`speak(channel)` - Switched',
      '`speak(channel, message)` - Useage',
      '`say()` - Empty',
      '`say(say test!)` - say test!',
    ])
  },

  zoneing: async function(msg, plugin, count) {
    Reply(msg, 'Testing Zoneing...')
    await plugin.time(msg, [], true)
    await plugin.time(msg, ['what'], true)
    await plugin.time(msg, ['9pm'], true)
    await plugin.time(msg, ['when', 'ever'], true)
    await plugin.zone(msg, [])
    await plugin.zone(msg, ['thing'])
    await plugin.zone(msg, ['America/Chicago'])
    await plugin.zones(msg, [], true)
    await plugin.setzone(msg, [])
    await plugin.setzone(msg, ['user'])
    await plugin.setzone(msg, ['user', 'America/Chicago'])
    await plugin.setzone(msg, [ user, 'America/Chicago'])
    return Reply(msg, `Finished Test ${count}.`, [
      '`time()` - Current Time',
      '`time(what)` - Bad Time',
      '`time(9pm)` - 9pm Time',
      '`time(when, ever)` - Useage',
      '`zone()` - Useage',
      '`zone(thing)` - Bad Zone',
      '`zone(America/Chicago)` - Set Zone',
      '`zones()` - List',
      '`setzone()` - Useage',
      '`setzone(string)` - Useage',
      '`setzone(string, zone)` - Bad User',
      '`setzone(user, zone)` - Set Zone'
    ])
  },

  aliases: async function(msg, plugin, count) {
    Reply(msg, 'Testing Aliases...')
    await plugin.alias(msg, [])
    await plugin.alias(msg, ['vxWkzT'])
    await plugin.alias(msg, ['vxWkzT', 'Alias Test'])
    await plugin.__run(msg, ['vxWkzT'])
    await plugin.forget(msg, ['vxWkzT', 'asdfasdf'])
    await plugin.forget(msg, ['vxWkzT'])
    await plugin.forget(msg, [])
    await plugin.aliases(msg, [])

    return Reply(msg, `Finished Test ${count}.`, [
      '`alias()` - Useage',
      '`alias(vxWkzT)` - Useage',
      '`alias(vxWkzT, testing)` - Updated',
      '`vxWkzT()` - Alias Test`',
      '`forget(vxWkzT, asdfasdf)` - Useage',
      '`forget(vxWkzT)` - Deleted',
      '`forget()` - Useage',
      '`aliases()` - List'
    ])
  }

}