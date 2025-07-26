const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Middleware pour vérifier que l'utilisateur est connecté
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
};

// Route tableau de bord
router.get('/dashboard', isAuthenticated, studentController.getDashboard);

module.exports = router;
