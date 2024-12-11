const jwt = require('jsonwebtoken');

function userAuthentication(req , res , next) {
    const token = req.headers.token;

    // verification

    const decodedData = jwt.verify(token , process.env.JWT_USER_SECRET);

    if (!decodedData) {
        res.status(401).json({
            msg: 'INCORRECT CREDENTIALS!, Cannot LogIN'
        })
    }
    else {
        req.userId = decodedData.id;
        next();
    }

}

module.exports = {
    userAuthentication: userAuthentication
}