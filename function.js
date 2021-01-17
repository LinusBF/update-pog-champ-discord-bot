'use strict';

const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');

exports.updatePog = (req, res) => {
  if(req.query.API_KEY !== process.env['API_KEY']) {
    res.status(401).send('Fuck off');
    return;
  }

  // Create an instance of a Discord client
  const client = new Discord.Client();

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const getRandomPog = () => {
    const files = [];
    fs.readdirSync('pogs').forEach(file => {
      console.log(file);
      files.push(file);
    });
    return files[getRandomInt(files.length)];
  }

  client.on('ready', () => {
    console.log('I am ready!');
    client.guilds.fetch(process.env['GUILD_ID'])
        .then(async (guild) => {
          const manager = guild.emojis;
          const pogChamp = manager.cache.find(e => e.name === 'PogChamp');
          if(pogChamp) {
            await pogChamp.delete();
          }
          const pogImage = getRandomPog();
          console.log(`Chosen pog ${pogImage}`);
          manager.create(fs.readFileSync(path.join(__dirname, 'pogs', pogImage)), 'PogChamp')
              .then(r => console.log('done'))
              .then(_ => res.status(200).send())
              .catch(e => {
                console.log(e.toString());
                res.status(500).send();
              });
        });
  });


  // Log our bot in using the token from https://discord.com/developers/applications
  client.login(process.env['DISCORD_BOT_TOKEN']);
};
