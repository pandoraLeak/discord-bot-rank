const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;
