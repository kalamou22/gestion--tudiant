const pool = require('../config/db');

const getAllEtudiants = async () => {
  const { rows } = await pool.query('SELECT * FROM etudiant ORDER BY nom ASC');
  return rows;
};

const getEtudiantById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM etudiant WHERE matricule = $1', [id]);
  return rows[0];
};

const ajouterEtudiant = async (etudiant) => {
  const { matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere } = etudiant;
  await pool.query(
    `INSERT INTO etudiant (matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere]
  );
};

const modifierEtudiant = async (id, etudiant) => {
  const { matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere } = etudiant;
  await pool.query(
    `UPDATE etudiant SET matricule=$1, nom=$2, prenom=$3, date_naissance=$4, adresse=$5, sexe=$6,
     nationalite=$7, universite=$8, classe=$9, filiere=$10 WHERE matricule=$11`,
    [matricule, nom, prenom, date_naissance, adresse, sexe, nationalite, universite, classe, filiere, id]
  );
};

const supprimerEtudiant = async (id) => {
  await pool.query('DELETE FROM etudiant WHERE matricule = $1', [id]);
};

module.exports = {
  getAllEtudiants,
  getEtudiantById,
  ajouterEtudiant,
  modifierEtudiant,
  supprimerEtudiant,
};
