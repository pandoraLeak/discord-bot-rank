// cette commande sert a rien c juste pour la deco xD
const Owner = require('../models/Owner');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'owner',
  buyerOnly: true, 
  async execute(message, args) {
    const option = args[0];

    if (!option) {
      return message.reply('Veuillez spécifier une option valide : add ou remove.');
    }

    const ownerId = message.author.id;

    if (option === 'add') {
      try {
        const mentionedUser = message.mentions.users.first();
        
        if (!mentionedUser) {
          return message.reply('Veuillez mentionner l\'utilisateur que vous souhaitez ajouter en tant que propriétaire.');
        }
    
        const ownerId = mentionedUser.id;
        const existingOwner = await Owner.findOne({ ownerId });
    
        if (existingOwner) {
          return message.reply(`<@${mentionedUser.id}> est déjà owner.`);
        }
    
        const owner = new Owner({ ownerId });
        await owner.save();
    
        return message.reply(`<@${mentionedUser.id}> est maintenant owner.`);
      } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'ajout du propriétaire :', error);
        return message.reply('Une erreur s\'est produite lors de l\'ajout du propriétaire.');
      }
        
    } else if (option === 'remove') {
      try {
        const mentionedUser = message.mentions.users.first();
        
        if (!mentionedUser) {
          return message.reply('Veuillez mentionner l\'utilisateur que vous souhaitez supprimer en tant que propriétaire.');
        }
    
        const ownerId = mentionedUser.id;
        const owner = await Owner.findOneAndDelete({ ownerId });
    
        if (owner) {
          return message.reply(`<@${owner.ownerId}> n'est plus owner.`);
        } else {
          return message.reply(`<@${ownerId}> n'est pas owner.`);
        }
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression du propriétaire :', error);
        return message.reply('Une erreur s\'est produite lors de la suppression du propriétaire.');
      }
        
    } else if (option === 'list') {
      try {
        const owners = await Owner.find();

        if (owners.length === 0) {
          return message.reply('Aucun owner n\'est enregistré.');
        }

        const embed = new MessageEmbed()
          .setTitle('Liste des owner')
          .setDescription('Voici la liste des owner:')
          .setURL('https://discord.gg/k3s');

        for (const owner of owners) {
          const user = await message.client.users.fetch(owner.ownerId);
          embed.addField(` \n`, `<@${owner.ownerId}>`);
        }

        return message.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la liste des owner :', error);
        return message.reply('Une erreur s\'est produite lors de la récupération de la liste des owner.');
      }
    } else {
      return message.reply('Option invalide. Veuillez spécifier add, remove ou list.');
    }
  },
};
