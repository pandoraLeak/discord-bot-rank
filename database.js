const mongoose = require('mongoose');
const config = require('./config.json');

const uri = config.mongoURI;

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, 
    });
    console.log('Connexion à la base de données MongoDB réussie !');
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données MongoDB :', error);
  }
}

function getDB() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('La connexion à la base de données MongoDB n\'a pas été établie.');
  }
  return mongoose.connection.db;
}

module.exports = {
  connect,
  getDB,
};
