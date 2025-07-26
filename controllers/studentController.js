const studentModel = require('../models/studentModel');

exports.afficherTous = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    // Récupérer la liste des étudiants
    const etudiants = await studentModel.getAllEtudiants();
    
    // Récupérer les messages flash
    const success = req.session.success;
    const error = req.session.error;
    
    // Nettoyer les messages flash
    delete req.session.success;
    delete req.session.error;
    
    res.render('dashboard', { 
      etudiants, 
      user: req.session.user,
      success,
      error
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.render('dashboard', { 
      etudiants: [], 
      user: req.session.user, 
      error: 'Erreur lors du chargement des étudiants. Veuillez réessayer.' 
    });
  }
};

exports.formulaireAjout = (req, res) => {
  res.render('add', { etudiant: null });
};

exports.ajouter = async (req, res) => {
  try {
    // Validation des données
    const { matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere } = req.body;
    
    if (!matricule || !nom || !prenom || !date_naissance || !adresse || !sexe || !nationalite || !universite || !classe || !filiere) {
      return res.render('add', { 
        etudiant: null, 
        error: 'Tous les champs sont obligatoires. Veuillez remplir tous les champs.' 
      });
    }

    await studentModel.ajouterEtudiant(req.body);
    
    // Message de succès
    req.session.success = `L'étudiant ${nom} ${prenom} (${matricule}) a été ajouté avec succès !`;
    
    res.redirect('/etudiants');
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
    
    let errorMessage = 'Erreur lors de l\'ajout de l\'étudiant.';
    
    // Messages d'erreur plus spécifiques
    if (error.code === '23505') {
      errorMessage = 'Ce matricule existe déjà. Veuillez utiliser un matricule unique.';
    } else if (error.code === '23502') {
      errorMessage = 'Tous les champs obligatoires doivent être remplis.';
    } else if (error.code === '23514') {
      errorMessage = 'Les données saisies ne respectent pas les contraintes de validation.';
    }
    
    res.render('add', { 
      etudiant: null, 
      error: errorMessage,
      formData: req.body // Pour pré-remplir le formulaire en cas d'erreur
    });
  }
};

exports.formulaireModifier = async (req, res) => {
  try {
    const etudiant = await studentModel.getEtudiantById(req.params.id);
    if (!etudiant) {
      req.session.error = 'Étudiant non trouvé.';
      return res.redirect('/etudiants');
    }
    res.render('add', { etudiant });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant:', error);
    req.session.error = 'Erreur lors de la récupération des données de l\'étudiant.';
    res.redirect('/etudiants');
  }
};

exports.modifier = async (req, res) => {
  try {
    // Validation des données
    const { matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere } = req.body;
    
    if (!matricule || !nom || !prenom || !date_naissance || !adresse || !sexe || !nationalite || !universite || !classe || !filiere) {
      const etudiant = await studentModel.getEtudiantById(req.params.id);
      return res.render('add', { 
        etudiant,
        error: 'Tous les champs sont obligatoires. Veuillez remplir tous les champs.' 
      });
    }

    await studentModel.modifierEtudiant(req.params.id, req.body);
    
    // Message de succès
    req.session.success = `Les informations de l'étudiant ${nom} ${prenom} (${matricule}) ont été modifiées avec succès !`;
    
    res.redirect('/etudiants');
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    
    let errorMessage = 'Erreur lors de la modification de l\'étudiant.';
    
    // Messages d'erreur plus spécifiques
    if (error.code === '23505') {
      errorMessage = 'Ce matricule existe déjà. Veuillez utiliser un matricule unique.';
    } else if (error.code === '23502') {
      errorMessage = 'Tous les champs obligatoires doivent être remplis.';
    } else if (error.code === '23514') {
      errorMessage = 'Les données saisies ne respectent pas les contraintes de validation.';
    }
    
    // Récupérer les données de l'étudiant pour réafficher le formulaire
    try {
      const etudiant = await studentModel.getEtudiantById(req.params.id);
      res.render('add', { 
        etudiant,
        error: errorMessage
      });
    } catch (retrieveError) {
      req.session.error = errorMessage;
      res.redirect('/etudiants');
    }
  }
};

exports.supprimer = async (req, res) => {
  try {
    // Récupérer les informations de l'étudiant avant suppression pour le message
    const etudiant = await studentModel.getEtudiantById(req.params.id);
    
    if (!etudiant) {
      req.session.error = 'Étudiant non trouvé.';
      return res.redirect('/etudiants');
    }
    
    await studentModel.supprimerEtudiant(req.params.id);
    
    // Message de succès
    req.session.success = `L'étudiant ${etudiant.nom} ${etudiant.prenom} (${etudiant.matricule}) a été supprimé avec succès.`;
    
    res.redirect('/etudiants');
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    req.session.error = 'Erreur lors de la suppression de l\'étudiant. Veuillez réessayer.';
    res.redirect('/etudiants');
  }
};
