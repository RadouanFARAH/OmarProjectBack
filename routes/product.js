var express = require('express');
var pool = require('./../config/db')
var router = express.Router();
var auth = require('../midelwares/authorization')

router.post('/getProductByCategory', auth, (req, res) => {
    let id = req.body.id;
    // pool.query(`select * from products where categorie=${id}`, (err, result) => {
    pool.query(`select P.*, U.nomprenom, U.tel from products as P join users as U on P.user = U.id where P.categorie=${id};`, (err, result) => {
        if (err) {
            console.log("Erreur dans la récupération des produits par catégorie : ", err);
            return res.status(500).json({})
        }
        else {
            return res.status(200).json(result);
        }
    })
})

router.post('/putProduct', auth, (req, res) => {
    let user = req.userID;
    let nom = req.body.nom;
    let prixInitial = req.body.prixInitial;
    let prixFinal = req.body.prixFinal;
    let category = req.body.category;
    let ville = req.body.ville;
    let description = req.body.description;

    pool.query(`insert into products (user, categorie, nom, prixinitial, prixfinal, description) values (2,${category}, "${nom}",${prixInitial},${prixFinal}, "${description}")`, (err, result) => {
        if (err) {
            console.log("Erreur dans l'insersion des produits : ", err);
            return res.status(500).json({})
        }
        else {
            return res.status(200).json(result);
        }
    })
})

module.exports = router;