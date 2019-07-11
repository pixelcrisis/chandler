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

  async run(msg, opts, plugins) {
    if (opts.length == 1 && this[opts[0]]) {
      await this[opts[0]](msg, plugins[opts[0]], 1, 1)
    } else {
      for (var i = 0; i < opts.length; i++) {
        let plugin = this[opts[i]]
        let skipped = `Skipping **${opts[i]}** Test ${i + 1}/${opts.length}`
        if (!plugin) Reply(msg, skipped)
        else {
          await plugin(msg, plugins[opts[i]], i + 1, opts.length)
          await sleep(10000)
        }
      }
    }
    return Reply(msg, 'Testing Completed.')
  },

  async manager(msg, plugin, count, max) {
    Reply(msg, 'Testing Manager...', [
      '`help()` - Message', 
      '`invite()` - Message',
      '`prefix()` - Useage',
      '`prefix(~)` - Changed',
      '`staff()` - Curr',
      '`staff(gibberish)` - Bad Role',
      '`staff(id)` - Set Staff',
      '`roles()` - List`'
    ])

    await plugin.help(msg, [])
    await plugin.invite(msg, [])
    await plugin.prefix(msg, [])
    await plugin.prefix(msg, ['~'])
    await plugin.staff(msg, [])
    await plugin.staff(msg, ['gibberish'])
    await plugin.staff(msg, [ staff ])
    await plugin.roles(msg, [])

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async editing(msg, plugin, count, max) {
    Reply(msg, 'Testing Editing...', [
      '`embed(string)` - Bad Parse',
      '`embed(embed) - Embed Test`',
      '`print()` - Message ID',
      '`clear()` - Useage',
      '`clear(2)` - Cleared Deleted',
      '`edit()` - Useage',
      '`edit(string)` - Useage',
      '`edit(string, thing) - Bad Message`',
      '`edit(id, string) - String Edit`',
      '`edit(id, embed) - Embed Edit`',
    ])

    await plugin.embed(msg, ['string'], true)
    await plugin.embed(msg, ['{','"title":','"Embed Test"','}'], true)
    await plugin.print(msg, ['1'], true)
    await msg.channel.send('Deleted 1')
    await msg.channel.send('Deleted 2')
    await msg.channel.send('sim >clear')
    await plugin.clear(msg, ['2'])
    await plugin.clear(msg, [])
    await plugin.edit(msg, [], true)
    await plugin.edit(msg, ['string'], true)
    await plugin.edit(msg, ['string', 'thing'], true)

    await msg.channel.send('_ _').then(async m => {
      await plugin.edit(msg, [m.id, 'String Edit'], true)
    })

    await msg.channel.send('_ _').then(async m => {
      await plugin.edit(msg, [m.id, '{ "title": "Embed Edit "}'], true)
    })

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async locking(msg, plugin, count, max) {
    Reply(msg, 'Testing Locking...', [
      '`lock()` - good',
      '`unlock()` - good'
    ])

    await plugin.lock(msg, [])
    await sleep(5000)
    await plugin.unlock(msg, [])

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async shifter(msg, plugin, count, max) {
    Reply(msg, 'Testing Shifter...', [
      '`shift()` - Useage',
      '`shift(2)` - Useage',
      '`shift(a, oh)` - Bad Channel',
      '`shift(2, channel)` - Shifted'
    ])
    await plugin.shift(msg, [])
    await plugin.shift(msg, ['2'])
    await plugin.shift(msg, ['a', 'oh'])
    await msg.channel.send('Shift Test 1')
    await msg.channel.send('Shift Test 2')
    await msg.channel.send('sim >shift')
    await plugin.shift(msg, ['2',  channel ])

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async talking(msg, plugin, count, max) {
    Reply(msg, 'Testing Talking...', [
      '`speak()` - Curr',
      '`speak(oh)` - Bad Channel',
      '`speak(channel)` - Switched',
      '`speak(channel, message)` - Useage',
      '`say()` - Empty',
      '`say(say test!)` - say test!',
    ])

    await plugin.speak(msg, [])
    await plugin.speak(msg, ['oh'])
    await plugin.speak(msg, [ channel ])
    await plugin.speak(msg, [ channel , 'message'])
    await plugin.say(msg, [])
    await plugin.say(msg, ['say','test!'])

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async zoneing(msg, plugin, count, max) {
    Reply(msg, 'Testing Zoneing...', [
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

    return Reply(msg, `Finished Test ${count}/${max}.`)
  },

  async aliases(msg, plugin, count, max) {
    Reply(msg, 'Testing Aliases...', [
      '`alias()` - Useage',
      '`alias(vxWkzT)` - Useage',
      '`alias(vxWkzT, testing)` - Updated',
      '`vxWkzT()` - Alias Test`',
      '`aliases()` - List',
      '`forget(vxWkzT, asdfasdf)` - Useage',
      '`forget(vxWkzT)` - Deleted',
      '`forget()` - Useage'
    ])

    await plugin.alias(msg, [])
    await plugin.alias(msg, ['vxWkzT'])
    await plugin.alias(msg, ['vxWkzT', 'Alias Test'])
    await plugin.__run(msg, ['vxWkzT'])
    await plugin.aliases(msg, [])
    await plugin.forget(msg, ['vxWkzT', 'asdfasdf'])
    await plugin.forget(msg, ['vxWkzT'])
    await plugin.forget(msg, [])

    return Reply(msg, `Finished Test ${count}/${max}.`)
  }

}