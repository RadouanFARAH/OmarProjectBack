var jwt = require('jsonwebtoken')

var authenticate = function (req, res, next) {
    let token = req.headers['authorization'].split(" ")[1]
    jwt.verify(token, process.env.key, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({})
        } else {
            req.userID = decodedToken.id
            next()
        }
    })
}

module.exports = authenticate