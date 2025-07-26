// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.getLogin = (req, res) => {
  // Récupérer les messages flash
  const error = req.session.error;
  const success = req.session.success;
  
  // Nettoyer les messages flash
  delete req.session.error;
  delete req.session.success;
  
  res.render('login', { error, success });
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validation des données
    if (!username || !password) {
      return res.render('login', { 
        error: 'Veuillez saisir votre nom d\'utilisateur et mot de passe.' 
      });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.render('login', { 
        error: 'Nom d\'utilisateur ou mot de passe incorrect. Veuillez réessayer.' 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.render('login', { 
        error: 'Nom d\'utilisateur ou mot de passe incorrect. Veuillez réessayer.' 
      });
    }

    // Auth OK : stocker l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Message de bienvenue
    req.session.success = `Bienvenue ${user.username} ! Vous êtes connecté en tant que ${user.role === 'admin' ? 'administrateur' : 'utilisateur'}.`;

    // Redirection selon le rôle
    if (user.role === 'admin') {
      return res.redirect('/etudiants'); // page admin
    } else {
      return res.redirect('/etudiants'); // même page pour le moment (lecture seule plus tard)
    }

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.render('login', { 
      error: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.' 
    });
  }
};

exports.logout = (req, res) => {
  const username = req.session.user?.username;
  req.session.destroy();
  
  // Message de déconnexion
  req.session = {};
  req.session.success = username ? `Vous avez été déconnecté avec succès. Au revoir ${username} !` : 'Vous avez été déconnecté avec succès.';
  
  res.redirect('/auth/login');
};
