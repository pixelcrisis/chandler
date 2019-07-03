# chandler
A Channel-Handling Discord Bot.  
He doesn't do much, but he does it well.  
  
&nbsp;  

### Editor
`>print X`  
Prints X messages, changing the content to the ID of the message.  
  
`>embed { embed }`  
Given the JSON for an embed, prints out that embed.

`>edit MSGID content`  
Replace bot message MSGID with "content".  
Supports text content as well as Embeds.

### Shifty
`>shift X #channel`  
Moves the last X messages to a different #channel.  
Aliases: `>move`

### Speaks
`>speak #channel`  
Set a #channel for the bot to speak in.

`>say message`  
Bot sends message to the aforementioned channel.

### Zoning
`>zone TIMEZONE`  
Using the format `America/Chicago`, records users timezone.

`>zones`  
Prints out local times for every users, with usernames.

`>time x`  
Prints out the local time for users in the server, no usernames.  
If passed a timestamp as `x`, such as `>time 9pm`, bot returns time at the specified time for users in the server.
