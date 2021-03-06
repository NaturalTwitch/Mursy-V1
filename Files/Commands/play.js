const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource
} = require('@discordjs/voice');
const queue = new Map()


module.exports = {
name: 'play',
aliases: ['skip', 'stop'],
description: "plays music in voice chat",
  async execute(client, message, cmd, args, Discord){

    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel) return message.channel.send('You need to in a voice channel to request music!');
    const permissions =voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has('CONNECT')) return message.channel.send("You don't have permissions to request music");

    const server_queue = queue.get(message.guild.id);

    if(cmd === 'play'){
      if(!args.length) return message.channel.send("You can't request no music Silly! >_<");
      let song = {};

      if(ytdl.validateURL(args[0])) {
        const song_info = await ytdl.getInfo(args[0]);
        song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
      } else {
        const video_finder = async (query) =>{
            const videoResult = await ytSearch(query);
            return (videoResult.videos.lenth > 1) ? videoResult.videos[0] : null;
          }

          const video = await video_finder(args.join(' '));
          if(video){
            song = { title: video.title, url: video.url }
          } else {
            message.channel.send("Couldn't Find the Music Requested!")
          }
        }

        if(!server_queue){
          const queue_constructor = {
            voiceChannel: voiceChannel,
            text_channel: message.channel,
            connection: null,
            songs: []
          }
          queue.set(message.guild.id, queue_constructor);
          queue_constructor.songs.push(song);

          try{
            const connection = joinVoiceChannel({
              channelId: message.member.voice.channel.id,
              guildId: message.guild.id,
              adapterCreator: message.guild.voiceAdapterCreator,
          });
            queue_constructor.connection = connection;
            video_player(message.guild, queue_constructor.songs[0]);
          } catch (err){
            queue.delete(message.guild.id);
            message.channel.send("There was an error connecting!");
            throw err;
          }
        } else {
          server_queue.songs.push(song);
          return message.channel.send(`:thumbsup: **${song.title}** added to queue!`);
        }
      }

    }
}

const video_player = async(guild, song) =>{
  const song_queue = queue.get(guild.id);


  if(!song){
    song_queue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: 'audioonly' });
  song_queue.connection.subscribe(stream, { seek: 0, volume: 0.5 })
  .on('idle', () => {
    song_queue.songs.shift();
    video_player(guild, song_queue.songs[0]);
  });
  await song_queue.text_channel.send(`:musical_note: Now Playing **${song.title}**`)
}
