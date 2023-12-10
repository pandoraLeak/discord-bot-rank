const { Permissions } = require('discord.js');


const cooldownUsers = new Map();

module.exports = {
  name: 'derank',
  buyerOnly: false,
  maxUses: 5,
  cooldown: 24 * 60 * 60 * 1000,
  allowedRoles: ['1128806583078502534', '1128806947907440720'], // ici tu met les id des role qui on la perm d'use la cmd
  async execute(message, args) {
    const targetUser = message.mentions.members.first();
    const memberRoles = message.member.roles.cache;

  
    if (!memberRoles.some((role) => this.allowedRoles.includes(role.id))) {
      return; 
    }
    if (!targetUser) {
      return message.reply('Veuillez mentionner l\'utilisateur à derank.');
    }

    const memberHighestRole = message.member.roles.highest;


    if (
      memberHighestRole.comparePositionTo(targetUser.roles.highest) <= 0 &&
      !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
      !this.allowedRoles.some((allowedRole) => message.member.roles.cache.has(allowedRole))
    ) {
      return message.reply(
        'Vous ne pouvez pas derank cet utilisateur car il a des permissions égales ou supérieures à votre rôle le plus élevé.'
      );
    }



    const userCooldown = cooldownUsers.get(message.author.id);

    const userUses = cooldownUsers.get(message.author.id)?.uses || 0;
    if (userUses >= this.maxUses) {
      return message.reply(`Vous avez atteint le nombre maximum d'utilisations de cette commande. Réessayez dans ${formatTime(this.cooldown)}.`);
    }

    const deranked = await derankUser(targetUser);

    if (deranked) {
      
      cooldownUsers.set(message.author.id, {
        cooldown: this.cooldown,
        timestamp: Date.now(),
        uses: userUses + 1,
      });

      return message.reply(`L'utilisateur ${targetUser.displayName} a été derank.`);
    } else {
      return message.reply(`Une erreur s'est produite lors du derank de l'utilisateur.`);
    }
  },
};

async function derankUser(user) {
  try {
    await user.roles.set([]);
    return true;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la rétrogradation de l\'utilisateur :', error);
    return false;
  }
}

function formatTime(time) {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const hours = Math.floor((time / 1000 / 60 / 60) % 24);

  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    formattedTime.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  if (seconds > 0) {
    formattedTime.push(`${seconds} seconde${seconds > 1 ? 's' : ''}`);
  }

  return formattedTime.join(', ');
}
