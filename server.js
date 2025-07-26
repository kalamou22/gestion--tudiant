// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();

// ROUTES
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'ipd-secret-key',
  resave: false,
  saveUninitialized: false
}));

// VUE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ROUTAGE
app.use('/auth', authRoutes);
app.use('/etudiants', studentRoutes);

// Redirection par défaut
app.get('/', (req, res) => res.redirect('/auth/login'));

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
