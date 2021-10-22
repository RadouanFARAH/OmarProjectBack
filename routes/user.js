var express = require('express');
var pool = require('./../config/db')
var router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    pwd = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(pwd, salt, function (err, hash) {
            pool.query(`select * from users where email = "${req.body.email}" or tel ="${req.body.tel}"`, (err, result) => {
                if (err) {
                    console.log("Erreur dans la recherche sur l'users pour l'inscription : ", req.body.email, " -- ", err);
                    return res.status(500).json({})
                } else if (result.length > 0) {
                    console.log("users ", req.body.email, "already exist");
                    return res.status(409).json({})
                } else {
                    pool.query(`insert into users (nomprenom, genre, role, email, tel, whatsapp, ville, adresselogement, adresseentreprise, password, dateinscription) values 
                    ("${req.body.nomprenom}", "${req.body.genre}", "${req.body.role}", "${req.body.email}", "${req.body.tel}", "${req.body.whatsapp}", "${req.body.ville}", "${req.body.adresselogement}", "${req.body.adresseentreprise}", "${hash}", "${new Date().toLocaleDateString()}")`,
                        (err, result) => {
                            if (err) {
                                console.log("Erreur dans l'inscription", err);
                                return res.status(500).json({});
                            }
                            else {
                                return res.status(200).json({});
                            }
                        })
                }
            })
        });
    });
})

router.post('/login', (req, res) => {
    pool.query(`select * from users where email = "${req.body.id}" or tel ="${req.body.id}"`, (err, result) => {
        if (err) {
            console.log("Erreur dans l'authentification : ", err);
            return res.status(500).json({})
        } else if (result.length > 0) {
            let user = result[0];
            bcrypt.compare(req.body.pwd, user.password, function (err, isMatch) {
                //
                if (isMatch) {
                    console.log("l'authentification faite avec succès : ", req.body);
                    var token = jwt.sign({ id: result[0].id }, process.env.key);
                    return res.status(200).json({ token })
                } else {
                    console.log("password incorrect ", req.body);
                    return res.status(500).json({})
                }
            });

        } else {
            console.log("identifiant incorrect ", req.body);
            return res.status(500).json({})
        }
    })
    // bcrypt.compare(req.body.pwd, user.password, function (err, isMatch) {
    // });
})


router.post('/getNumberUsersByRole', (req, res) => {
    req.body.roleC = "C";
    req.body.roleV = "V";

    pool.query(`select count(id), ville from users where role = "${req.body.roleC}" and ville ="${req.body.ville}"`, (err, result) => {
        if (err) {
            console.log("Erreur dans l'authentification : ", err);
            return res.status(500).json({})
        } else {
            return res.status(200).json({ result })
        }
    })

    pool.query(`select count(id), ville from users where role = "${req.body.roleV}" and ville ="${req.body.ville}"`, (err, result) => {
        if (err) {
            console.log("Erreur dans l'authentification : ", err);
            return res.status(500).json({})
        } else {
            return res.status(200).json({ result })
        }
    })
})

module.exports = router;