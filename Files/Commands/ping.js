const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'ping',
  description: "This is the ping command!",
  execute(client, message, cmd, args, Discord){
    const pingEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Pong!')
      .setDescription(`🏓 **${Math.round(client.ws.ping)}ms.**`)
    message.channel.send({ embeds: [pingEmbed] });


  }
}
