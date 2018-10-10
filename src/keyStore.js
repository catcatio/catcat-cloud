const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost', {
  user: 'root',
  pass: 'password',
  useNewUrlParser: true
});

var pgpKeySchema = new mongoose.Schema({
  name: String,
  email: String,
  privateKeyArmored: String,
  publicKeyArmored: String
});

const PGPKey = mongoose.model('PGPKey', pgpKeySchema);

const savePGPKey = (name, email, publicKeyArmored,  privateKeyArmored) => new Promise((resolve) => {
  const pgpKey = new PGPKey({
    name,
    email,
    publicKeyArmored,
    privateKeyArmored
  })

  pgpKey.save((error) => {
    if (error) {
      console.log('uploaded failed:', error.message)
    }
    return resolve({success: !!error, error})
  })

})

module.exports = {
  PGPKey,
  savePGPKey
}

