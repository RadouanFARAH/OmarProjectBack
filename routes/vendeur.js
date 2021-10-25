var express = require('express');
var pool = require('../config/db')
var router = express.Router();
var auth = require('../midelwares/authorization')

router.get('/',auth, (req, res) => {
    let idvendeur=req.userID;
    let day = new Date().getDay();
    let dateActuelle = new Date().toISOString().split('T')[0]
    let consoRefuse = `(select count(id) from rejets where idvendeur=${idvendeur} and daterejet = ${dateActuelle}) as consoRefuse `;
    pool.query(`select (select B.quartier  from vendeur_day_zone as A join villes as B on A.idquartier=B.idquartier where A.day = ${day} and A.idvendeur=${idvendeur} ) as zone, (select A.nomprenom from users as A join resposablevendeur as B on A.id= B.idresponsable where B.idvendeur=${idvendeur}) as responsable, (select nomprenom from users where id=${idvendeur}) as vendeur, (select sum(pointtotal) from orders where idVendeur=${idvendeur} and (datecommande="${dateActuelle}")) as noteJour, (select count(id) from vendeurconsommateur where idvendeur=${idvendeur} and idquartier=(select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day})) as nbrTotalConso, (select count(idConsommateur) from (SELECT DISTINCT idConsommateur FROM orders where idVendeur=${idvendeur} and datecommande="${dateActuelle}") as T) as consoValide, (select count(*) from (select idconsommateur from vendeurconsommateur where idvendeur=${idvendeur} and idquartier=(select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day}) and idconsommateur not in (select DISTINCT idConsommateur from orders where idVendeur = ${idvendeur} and datecommande ="${dateActuelle}" and idConsommateur in (select id from users where quartier = (select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day})))) as T) as consoAttente, ${consoRefuse}`, (err, result) => {
        if (err) {
            console.log("Erreur dans la récupération des vendeur_dashboard : ", err);
            return res.status(500).json({})
        }
        else { 
            return res.status(200).json(result);
        }
    })
})
router.get('/consoValide', auth, (req, res)=>{
    let idvendeur=req.userID
    let dateActuelle = new Date().toISOString().split('T')[0]
    pool.query(`select  A.*, B.*, "V" as etatDemande from orders as A join  users as B on A.idconsommateur = B.id where idvendeur =${idvendeur} and datecommande="${dateActuelle}"`, (err, result) => {
        if (err) {
            console.log("Erreur dans la récupération des vendeur_dashboard : ", err);
            return res.status(500).json({})
        }
        else {
            return res.status(200).json(result);
        }
    })
})

router.get(`/getConsoGlobal`,(req,res)=>{
    let idvendeur = req.userID
    let day = new Date().getDay();
    pool.query(`select * from users where id in (select idconsommateur from vendeurconsommateur where idvendeur=${idvendeur} and idquartier=(select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day}))`, (err, result)=>{
        if (err) {
            console.log("Erreur dans la récupération des vendeur_dashboard getConsoGlobal: ", err);
            return res.status(500).json({})
        }else{
            return res.status(200).json(result);
        }
    })
})
router.post(`/getConsoGlobalByQuartier`,(req,res)=>{
    let idquartier = req.body.idquartier
    let idvendeur = req.userID
    let day = new Date().getDay();
    pool.query(`select * from users where id in (select idconsommateur from vendeurconsommateur where idvendeur=${idvendeur} and idquartier=(select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day})) and quartier=${idquartier}`, (error, result)=>{
        if (error) {
            console.log("Erreur dans la récupération des vendeur_dashboard getConsoGlobalbyQuartier: ", err);
            return res.status(500).json({})
        }else{
            return res.status(200).json(result);
        }
    })
})
router.get('/consoAttente', auth, (req, res)=>{
    let idvendeur=req.userID
    let dateActuelle = new Date().toISOString().split('T')[0]
    let day = new Date().getDay();
    pool.query(`select  *, "A" as etatDemande from  users where id in (select idconsommateur from vendeurconsommateur where idvendeur=${idvendeur} and idquartier=(select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day}) and idconsommateur not in (select DISTINCT idConsommateur from orders where idVendeur = ${idvendeur} and datecommande ="${dateActuelle}" and idConsommateur in (select id from users where quartier = (select idquartier from vendeur_day_zone where idvendeur=${idvendeur} and day=${day}))))`, (err, result) => {
        if (err) {
            console.log("Erreur dans la récupération des vendeur_dashboard : ", err);
            return res.status(500).json({})
        }
        else {
            return res.status(200).json(result);
        }
    })
})
module.exports = router;
