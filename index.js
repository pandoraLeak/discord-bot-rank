//debrouille toi pour le config si t'arrive pas sert a rien de demander ce code date de ya 3/4 mois et jai honetement pas envie d'aidez quelqun a le config 

const Discord = require('discord.js');
const { Intents } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose');
const client = new Discord.Client({ 
  intents: [
    Intents.FLAGS.GUILDS,                      
    Intents.FLAGS.GUILD_MEMBERS,               
    Intents.FLAGS.GUILD_BANS,                  
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,  
    Intents.FLAGS.GUILD_WEBHOOKS,             
    Intents.FLAGS.GUILD_INVITES,               
    Intents.FLAGS.GUILD_VOICE_STATES,          
    Intents.FLAGS.GUILD_PRESENCES,           
    Intents.FLAGS.GUILD_MESSAGES,           
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,     
    Intents.FLAGS.GUILD_MESSAGE_TYPING,       
    Intents.FLAGS.DIRECT_MESSAGES,             
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,    
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,       //normalement ya toute les intent la plupart servent a rien si ta un minimum de connaisance tu peux add des commande ou supp les intent inutile javais juste la flm comme ce code depuis l'ete 2023 et il ma jamais servis xD
  ],
});

const prefix = config.prefix;

const buyerId = config.buyerId;
const token = config.token;


const uri = config.mongoURI;

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, 
    });
    console.log('jsuis co a mongodb https://discord.gg/k3s encore une fois !');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données MongoDB :', error);
  }
}


connect();

client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log('jsuis en marche https://discord.gg/k3s!');
  client.user.setActivity('.gg/k3s', { type: 'PLAYING' });
});

client.on('messageCreate', (message) => {
  
  if (!message.content.startsWith(prefix) || message.author.bot) return;

 
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

 
  if (!command) return;


  if (command.buyerOnly && message.author.id !== buyerId) {
    return message.reply('Vous n\'êtes pas autorisé à utiliser cette commande, https://discord.gg/k3s en cas de probleme');
  }

  
  try {
    command.execute(message, args);
     message.reply('https://discord.gg/k3s ')
  } catch (error) {
    console.error(error);
    message.reply('Une erreur s\'est produite lors de l\'exécution de la commande. https://discord.gg/k3s en cas de probleme');
  }
});

client.login(token);
