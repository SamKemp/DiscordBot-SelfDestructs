require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

MessageTimeout = 10;
WatchChannelID = 555188113840799751;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})
client.on("message", msg => {

  // Ignore DM's
  if(!msg.guild) return;

  if(msg.author.id == client.user.id)
  {
    msg.delete({ timeout: MessageTimeout*1000 }).catch(console.error);
    return;
  }

  if (msg.channel.id == WatchChannelID)
  {
    msg.delete().catch(console.error);
    msg.channel.send(msg.content);
  }
  else if(msg.content === "¬here")
  {
    msg.delete().catch(console.error);
    WatchChannelID = msg.channel.id;
    msg.channel.send("Watch channel updated");
  }
})

client.login(process.env.BOT_TOKEN);