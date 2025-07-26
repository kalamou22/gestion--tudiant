require("dotenv").config(); // Charge les variables d'environnement

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  'etudiants',       // Nom de la base
  'postgres',        // Nom d'utilisateur
  'passer',          // Mot de passe
  {
    host: 'localhost',   // Adresse du serveur
    dialect: "postgres",
    port: 5433,          // Port PostgreSQL
    logging: false
  }
);

module.exports = sequelize;