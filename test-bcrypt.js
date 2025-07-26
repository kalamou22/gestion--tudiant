const bcrypt = require('bcrypt');

async function generateHash(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log(`Mot de passe: ${plainPassword} → Hash: ${hash}`);
}

generateHash('admin');       // 🔐 mot de passe pour admin
generateHash('user123');     // 🔐 mot de passe pour utilisateur
