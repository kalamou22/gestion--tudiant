const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Routes CRUD
router.get('/', studentController.afficherTous);
router.get('/ajouter', studentController.formulaireAjout);
router.post('/ajouter', studentController.ajouter);
router.get('/modifier/:id', studentController.formulaireModifier);
router.post('/modifier/:id', studentController.modifier);
router.post('/supprimer/:id', studentController.supprimer);

module.exports = router;
