const jwt = require('jsonwebtoken');

function adminAuthentication(req , res , next) {
    const token = req.headers.token;

    // verification

    const decodedData = jwt.verify(token , process.env.JWT_ADMIN_SECRET);

    if (!decodedData) {
        res.status(401).json({
            msg: 'INCORRECT CREDENTIALS!, Cannot LogIN'
        })
    }
    else {
        req.adminId = decodedData.id;
        next();
    }

}

module.exports = {
    adminAuthentication: adminAuthentication
}