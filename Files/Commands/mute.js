const { MessageEmbed } = require('discord.js')


module.exports = {
  name: 'mute',
  description: "mutes people in your server",
  execute(client, message, cmd, args, Discord){
    const member = message.mentions.users.first();
    const user = message.mentions.members.first();
    let admin = message.author.username;
    let server = message.guild.name;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "No reason provided";

    if(message.member.permissions.has('MUTE_MEMBERS')){
      const target = message.mentions.users.first();



      if(target){
          let muteRole = message.guild.roles.cache.find(role => role.name === 'muted');
          let memberTarget = message.guild.members.cache.get(target.id);


          memberTarget.roles.add(muteRole.id)
          const muteEmbed = new MessageEmbed()
          	.setColor('BLACK')
            .setTitle(`Mute 🔇`)
            .setThumbnail(`${message.mentions.users.first().displayAvatarURL()}`)
          	.setDescription(`<@${memberTarget.user.id}> has been muted`)
            .addField('Reason:', `${reason}`)
            .setFooter(`Muted by ${admin}`)
            .setTimestamp()

          const muteDmEmbed = new MessageEmbed()
          .setColor('RED')
          .setThumbnail(`${message.guild.iconURL()}`)
          .setTitle(`You were Muted in **${server}**!`)
          .addField('Reason', `${reason}`)
          .setFooter(`You were muted by ${admin}`)
          .setTimestamp()

          user.send({ embeds: [muteDmEmbed] });
          message.channel.send({ embeds: [muteEmbed] });
          message.channel.bulkDelete(1);

      } else {
        const mentionEmbed = new MessageEmbed()
          .setColor('YELLOW')
          .setDescription(`Please remember to mention the user *(Members, UserID)`)
        message.channel.send({ embeds: [mentionEmbed] });
      }
    } else {
      const accessEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`You Don't Have Enough Permissions To Execute This Command!`)

      message.channel.send({ embeds: [accessEmbed] });

    }
  }
}
