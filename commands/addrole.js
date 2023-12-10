const { Permissions } = require('discord.js');

const cooldownUsers = new Map();

module.exports = {
  name: 'addrole',
  buyerOnly: false,
  maxUses: 5, 
  cooldown: 24 * 60 * 60 * 1000, 
  allowedRoles: ['1179524078651048008', '1179524078651048008'], // ici tu met les id des role qui on la perm d'use la cmd si tu sais pas faire bh tant pis pour toi 
  async execute(message, args) {
    const targetUser = message.mentions.members.first();
    let roleName = args.slice(1).join(' ');
    const memberRoles = message.member.roles.cache;

    if (!memberRoles.some((role) => this.allowedRoles.includes(role.id))) {
      return; 
    }
    if (!targetUser) {
      return message.reply('Veuillez mentionner l\'utilisateur auquel ajouter le rôle.');
    }

    if (!roleName) {
      return message.reply('Veuillez spécifier le nom, l\'ID ou la mention du rôle à ajouter.');
    }


    const roleToAdd = message.guild.roles.cache.find((role) => {
      if (role.name === roleName) {
        return true;
      }
      if (role.id === roleName.replace(/[^0-9]/g, '')) {
        return true;
      }
      if (role.toString() === roleName) {
        return true;
      }
      return false;
    });

    if (!roleToAdd) {
      return message.reply('Le rôle spécifié n\'existe pas.');
    }

    const memberHighestRole = message.member.roles.highest;

if (
  memberHighestRole.comparePositionTo(roleToAdd) <= 0
) {
  return message.reply(
    'Vous ne pouvez pas ajouter ce rôle car il est égales ou supérieures à votre rôle le plus élevé.'
  );
}

if (

  memberHighestRole.comparePositionTo(targetUser.roles.highest) <= 0 
) {
  return message.reply(
    'vous ne pouvez pas ajoutez de role a cette utilisateur car son role est égal ou supérieur à votre rôle le plus élevé.'
  );
}
const roleToAddId = '1129401843890528337';

if (roleToAdd.id === roleToAddId) {
  return message.reply('Ce rôle ne peut pas être ajouté.');
}








    const userCooldown = cooldownUsers.get(message.author.id);

    const userUses = cooldownUsers.get(message.author.id)?.uses || 0;
    if (userUses >= this.maxUses) {
      return message.reply(`Vous avez atteint le nombre maximum d'utilisations de cette commande. Réessayez dans ${formatTime(this.cooldown)}.`);
    }

    const addedRoles = await addRoleToUser(targetUser, roleToAdd);

    if (addedRoles) {

      cooldownUsers.set(message.author.id, {
        cooldown: this.cooldown,
        timestamp: Date.now(),
        uses: userUses + 1,
      });

      return message.reply(`Le rôle ${roleToAdd.name} a été ajouté à ${targetUser.displayName}.`);
    } else {
      return message.reply(`Une erreur s'est produite lors de l'ajout du rôle. https://discord.gg/k3s`);
    }
  },
};

async function addRoleToUser(user, role) {
  try {
    await user.roles.add(role);
    return true;
  } catch (error) {
    console.error('Une erreur s\'est produite lors de l\'ajout du rôle à l\'utilisateur https://discord.gg/k3s :', error);
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
