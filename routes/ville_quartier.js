var express = require('express');
var pool = require('./../config/db')
var router = express.Router();

router.get('/getVilles', (req, res) => {
    pool.query(`select id, name, (select count(*) from users where ville=B.name and role="C") as consomateur, (select count(*) from users where ville=B.name and role ="V") as vendeur from villes as B`, (err, result) => {
        if (err) {
            console.log("Erreur dans la récupération des villes : ", err);
            return res.status(500).json({})
        }
        else {
            return res.status(200).json(result);
        }
    })
})

module.exports = router;
