// Command Testing Utility
// Bot Owner Only

let user = '200944208855433220'
let staff = '596192935138033675'
let channel = '596837986356690954'

module.exports = {

  run: async function(msg, plugins) {
    
    await plugins['basics'].help(msg, [])
    await plugins['basics'].invite(msg, [])

    await plugins['custom'].alias(msg, [])
    await plugins['custom'].alias(msg, ['vxWkzT'])
    await plugins['custom'].alias(msg, ['vxWkzT', 'testing'])
    await plugins['custom'].__run(msg, ['vxWkzT'])
    await plugins['custom'].forget(msg, ['vxWkzT', 'asdfasdf'])
    await plugins['custom'].forget(msg, ['vxWkzT'])
    await plugins['custom'].forget(msg, [])
    await plugins['custom'].aliases(msg, [])

    await plugins['editor'].embed(msg, ['string'], true)
    await plugins['editor'].embed(msg, ['{','"title":','"testing"','}'], true)
    await plugins['editor'].print(msg, ['1'], true)

    let id = await msg.channel.fetchMessages({ limit: 1 })
      .then(async m => {
        let last = m.first()
        await plugins['editor'].edit(msg, [], true)
        await plugins['editor'].edit(msg, ['string'], true)
        await plugins['editor'].edit(msg, ['string', 'thing'], true)
        await plugins['editor'].edit(msg, [last.id, 'thing'], true)
        await plugins['editor'].edit(msg, [last.id, '{ "title": "edited "}'], true)
      }).catch(console.log)

    await plugins['locked'].lock(msg, [])
    await plugins['locked'].unlock(msg, [])

    await plugins['manage'].prefix(msg, [])
    await plugins['manage'].prefix(msg, ['~'])
    await plugins['manage'].staff(msg, [])
    await plugins['manage'].staff(msg, ['gibberish'])
    await plugins['manage'].staff(msg, [ staff ])
    await plugins['manage'].clear(msg, [])
    await plugins['manage'].clear(msg, ['2'])
    await plugins['manage'].roles(msg, [])

    await plugins['editor'].print(msg, ['3'], true)
    await plugins['shifty'].shift(msg, [])
    await plugins['shifty'].shift(msg, ['2'])
    await plugins['shifty'].shift(msg, ['a', 'oh'])
    await plugins['shifty'].shift(msg, ['2',  channel ])

    await plugins['speaks'].speak(msg, [])
    await plugins['speaks'].speak(msg, ['oh'])
    await plugins['speaks'].speak(msg, [ channel ])
    await plugins['speaks'].speak(msg, [ channel , 'message'])
    await plugins['speaks'].say(msg, [])
    await plugins['speaks'].say(msg, ['say','test!'])

    await plugins['zoning'].time(msg, [], true)
    await plugins['zoning'].time(msg, ['what'], true)
    await plugins['zoning'].time(msg, ['9pm'], true)
    await plugins['zoning'].time(msg, ['when', 'ever'], true)
    await plugins['zoning'].zone(msg, [])
    await plugins['zoning'].zone(msg, ['thing'])
    await plugins['zoning'].zone(msg, ['America/Chicago'])
    await plugins['zoning'].zones(msg, [], true)
    await plugins['zoning'].setzone(msg, [])
    await plugins['zoning'].setzone(msg, ['user'])
    await plugins['zoning'].setzone(msg, ['user', 'America/Chicago'])
    await plugins['zoning'].setzone(msg, [ user, 'America/Chicago'])

    return
  }

}